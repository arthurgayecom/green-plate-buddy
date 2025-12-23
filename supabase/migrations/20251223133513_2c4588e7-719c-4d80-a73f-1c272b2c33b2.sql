-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student', 'cafeteria');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  recovery_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cafeteria_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  carbon_footprint DECIMAL(10, 2) NOT NULL DEFAULT 0,
  health_score INTEGER NOT NULL DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  calories INTEGER,
  protein_g DECIMAL(10, 2),
  carbs_g DECIMAL(10, 2),
  fat_g DECIMAL(10, 2),
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  image_url TEXT,
  menu_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Menu policies - everyone can view, cafeteria can manage
CREATE POLICY "Anyone authenticated can view menu items" ON public.menu_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cafeteria users can insert menu items" ON public.menu_items
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = cafeteria_user_id);

CREATE POLICY "Cafeteria users can update their menu items" ON public.menu_items
  FOR UPDATE TO authenticated
  USING (auth.uid() = cafeteria_user_id);

CREATE POLICY "Cafeteria users can delete their menu items" ON public.menu_items
  FOR DELETE TO authenticated
  USING (auth.uid() = cafeteria_user_id);

-- Create food photos table (for daily food and waste photos)
CREATE TABLE public.food_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cafeteria_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('food', 'waste')),
  description TEXT,
  estimated_carbon_kg DECIMAL(10, 2),
  photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on food_photos
ALTER TABLE public.food_photos ENABLE ROW LEVEL SECURITY;

-- Food photos policies
CREATE POLICY "Anyone authenticated can view food photos" ON public.food_photos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cafeteria users can insert food photos" ON public.food_photos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = cafeteria_user_id);

CREATE POLICY "Cafeteria users can delete their photos" ON public.food_photos
  FOR DELETE TO authenticated
  USING (auth.uid() = cafeteria_user_id);

-- Create student meal selections (carbon tracking)
CREATE TABLE public.meal_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  carbon_saved DECIMAL(10, 2) DEFAULT 0,
  selection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on meal_selections
ALTER TABLE public.meal_selections ENABLE ROW LEVEL SECURITY;

-- Meal selections policies
CREATE POLICY "Students can view their own selections" ON public.meal_selections
  FOR SELECT TO authenticated USING (auth.uid() = student_user_id);

CREATE POLICY "Students can insert their own selections" ON public.meal_selections
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_user_id);

CREATE POLICY "Students can delete their own selections" ON public.meal_selections
  FOR DELETE TO authenticated
  USING (auth.uid() = student_user_id);

-- Create daily carbon stats (aggregated for cafeteria view)
CREATE TABLE public.daily_carbon_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cafeteria_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_food_carbon_kg DECIMAL(10, 2) DEFAULT 0,
  total_waste_carbon_kg DECIMAL(10, 2) DEFAULT 0,
  meals_served INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cafeteria_user_id, stat_date)
);

-- Enable RLS on daily_carbon_stats
ALTER TABLE public.daily_carbon_stats ENABLE ROW LEVEL SECURITY;

-- Carbon stats policies
CREATE POLICY "Anyone authenticated can view carbon stats" ON public.daily_carbon_stats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cafeteria users can manage their stats" ON public.daily_carbon_stats
  FOR ALL TO authenticated
  USING (auth.uid() = cafeteria_user_id)
  WITH CHECK (auth.uid() = cafeteria_user_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role, recovery_key)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student'),
    NEW.raw_user_meta_data ->> 'recovery_key'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for food photos
INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos', 'food-photos', true);

-- Storage policies for food photos
CREATE POLICY "Anyone can view food photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'food-photos');

CREATE POLICY "Authenticated users can upload food photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'food-photos');

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);