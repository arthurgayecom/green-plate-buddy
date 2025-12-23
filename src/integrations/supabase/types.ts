export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      daily_carbon_stats: {
        Row: {
          cafeteria_user_id: string
          created_at: string
          id: string
          meals_served: number | null
          stat_date: string
          total_food_carbon_kg: number | null
          total_waste_carbon_kg: number | null
        }
        Insert: {
          cafeteria_user_id: string
          created_at?: string
          id?: string
          meals_served?: number | null
          stat_date?: string
          total_food_carbon_kg?: number | null
          total_waste_carbon_kg?: number | null
        }
        Update: {
          cafeteria_user_id?: string
          created_at?: string
          id?: string
          meals_served?: number | null
          stat_date?: string
          total_food_carbon_kg?: number | null
          total_waste_carbon_kg?: number | null
        }
        Relationships: []
      }
      food_photos: {
        Row: {
          cafeteria_user_id: string
          created_at: string
          description: string | null
          estimated_carbon_kg: number | null
          id: string
          photo_date: string
          photo_type: string
          photo_url: string
        }
        Insert: {
          cafeteria_user_id: string
          created_at?: string
          description?: string | null
          estimated_carbon_kg?: number | null
          id?: string
          photo_date?: string
          photo_type: string
          photo_url: string
        }
        Update: {
          cafeteria_user_id?: string
          created_at?: string
          description?: string | null
          estimated_carbon_kg?: number | null
          id?: string
          photo_date?: string
          photo_type?: string
          photo_url?: string
        }
        Relationships: []
      }
      meal_selections: {
        Row: {
          carbon_saved: number | null
          created_at: string
          id: string
          menu_item_id: string
          selection_date: string
          student_user_id: string
        }
        Insert: {
          carbon_saved?: number | null
          created_at?: string
          id?: string
          menu_item_id: string
          selection_date?: string
          student_user_id: string
        }
        Update: {
          carbon_saved?: number | null
          created_at?: string
          id?: string
          menu_item_id?: string
          selection_date?: string
          student_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_selections_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          cafeteria_user_id: string
          calories: number | null
          carbon_footprint: number
          carbs_g: number | null
          created_at: string
          description: string | null
          fat_g: number | null
          health_score: number
          id: string
          image_url: string | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          menu_date: string
          name: string
          protein_g: number | null
        }
        Insert: {
          cafeteria_user_id: string
          calories?: number | null
          carbon_footprint?: number
          carbs_g?: number | null
          created_at?: string
          description?: string | null
          fat_g?: number | null
          health_score?: number
          id?: string
          image_url?: string | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          menu_date?: string
          name: string
          protein_g?: number | null
        }
        Update: {
          cafeteria_user_id?: string
          calories?: number | null
          carbon_footprint?: number
          carbs_g?: number | null
          created_at?: string
          description?: string | null
          fat_g?: number | null
          health_score?: number
          id?: string
          image_url?: string | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          menu_date?: string
          name?: string
          protein_g?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          recovery_key: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          recovery_key?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          recovery_key?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "cafeteria"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["student", "cafeteria"],
    },
  },
} as const
