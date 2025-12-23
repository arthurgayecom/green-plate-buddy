import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, GraduationCap, ChefHat, TrendingDown, Utensils } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card/20 backdrop-blur-md mb-6">
            <Leaf className="w-10 h-10 text-primary-foreground animate-leaf-sway" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight">
            EcoTaste Buds
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Sustainable eating for students and cafeterias. Track carbon, reduce waste, eat healthy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="xl"
              variant="hero"
              onClick={() => navigate("/auth")}
              className="gap-3"
            >
              <GraduationCap className="w-5 h-5" />
              I'm a Student
            </Button>
            <Button
              size="xl"
              variant="hero"
              onClick={() => navigate("/auth")}
              className="gap-3"
            >
              <ChefHat className="w-5 h-5" />
              I'm Cafeteria Staff
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Utensils className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Daily Menus</h3>
              <p className="text-muted-foreground">
                Cafeterias upload daily menus with health scores and carbon footprint data
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingDown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track Carbon</h3>
              <p className="text-muted-foreground">
                See real-time carbon emissions from food served and waste generated
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Make Impact</h3>
              <p className="text-muted-foreground">
                Students choose eco-friendly meals and track their personal carbon savings
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
