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
      activity_logs: {
        Row: {
          action_type: string
          changes: Json | null
          created_at: string
          entity_id: string
          entity_name: string
          entity_type: string
          id: string
          performed_by: string | null
          performed_by_email: string
        }
        Insert: {
          action_type: string
          changes?: Json | null
          created_at?: string
          entity_id: string
          entity_name?: string
          entity_type?: string
          id?: string
          performed_by?: string | null
          performed_by_email?: string
        }
        Update: {
          action_type?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string
          entity_name?: string
          entity_type?: string
          id?: string
          performed_by?: string | null
          performed_by_email?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          address: string | null
          bio: string | null
          birth_place: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          date_of_death: string | null
          death_place: string | null
          email: string | null
          gender: string
          generation: number
          id: string
          name: string
          notes: string | null
          parent_ids: string[] | null
          phone: string | null
          relationship: string
          spouse_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          bio?: string | null
          birth_place?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          date_of_death?: string | null
          death_place?: string | null
          email?: string | null
          gender?: string
          generation?: number
          id?: string
          name: string
          notes?: string | null
          parent_ids?: string[] | null
          phone?: string | null
          relationship?: string
          spouse_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          bio?: string | null
          birth_place?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          date_of_death?: string | null
          death_place?: string | null
          email?: string | null
          gender?: string
          generation?: number
          id?: string
          name?: string
          notes?: string | null
          parent_ids?: string[] | null
          phone?: string | null
          relationship?: string
          spouse_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_spouse_id_fkey"
            columns: ["spouse_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_relationships: {
        Row: {
          created_at: string
          id: string
          member_id: string
          related_member_id: string
          relationship_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          related_member_id: string
          relationship_type: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          related_member_id?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_related_member_id_fkey"
            columns: ["related_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_primary: boolean | null
          member_id: string
          photo_url: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          member_id: string
          photo_url: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          member_id?: string
          photo_url?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_photos_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "pending"
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
      app_role: ["admin", "editor", "viewer", "pending"],
    },
  },
} as const
