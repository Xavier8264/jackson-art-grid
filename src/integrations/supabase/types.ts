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
      artists: {
        Row: {
          art_forms: Database["public"]["Enums"]["art_type"][] | null
          available_for_commission: boolean | null
          bio: string | null
          created_at: string
          email: string | null
          facebook: string | null
          id: string
          image_url: string | null
          instagram: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          art_forms?: Database["public"]["Enums"]["art_type"][] | null
          available_for_commission?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          art_forms?: Database["public"]["Enums"]["art_type"][] | null
          available_for_commission?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      artworks: {
        Row: {
          artist_id: string
          created_at: string
          description: string | null
          dimensions: string | null
          for_sale: boolean | null
          id: string
          image_url: string | null
          medium: string | null
          price: number | null
          title: string
          updated_at: string
          year_created: number | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          for_sale?: boolean | null
          id?: string
          image_url?: string | null
          medium?: string | null
          price?: number | null
          title: string
          updated_at?: string
          year_created?: number | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          for_sale?: boolean | null
          id?: string
          image_url?: string | null
          medium?: string | null
          price?: number | null
          title?: string
          updated_at?: string
          year_created?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artworks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      event_artists: {
        Row: {
          artist_id: string
          event_id: string
          id: string
          role: string | null
        }
        Insert: {
          artist_id: string
          event_id: string
          id?: string
          role?: string | null
        }
        Update: {
          artist_id?: string
          event_id?: string
          id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_artists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          accessibility_notes: string | null
          art_type: Database["public"]["Enums"]["art_type"] | null
          cost_type: Database["public"]["Enums"]["cost_type"] | null
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          image_url: string | null
          is_recurring: boolean | null
          recurrence_pattern: string | null
          start_time: string | null
          ticket_price: number | null
          ticket_url: string | null
          title: string
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          accessibility_notes?: string | null
          art_type?: Database["public"]["Enums"]["art_type"] | null
          cost_type?: Database["public"]["Enums"]["cost_type"] | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          start_time?: string | null
          ticket_price?: number | null
          ticket_url?: string | null
          title: string
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          accessibility_notes?: string | null
          art_type?: Database["public"]["Enums"]["art_type"] | null
          cost_type?: Database["public"]["Enums"]["cost_type"] | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          start_time?: string | null
          ticket_price?: number | null
          ticket_url?: string | null
          title?: string
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          accessibility_info: string | null
          address: string
          art_types: Database["public"]["Enums"]["art_type"][] | null
          city: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          state: string
          updated_at: string
          website: string | null
          zip: string | null
        }
        Insert: {
          accessibility_info?: string | null
          address: string
          art_types?: Database["public"]["Enums"]["art_type"][] | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          state?: string
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Update: {
          accessibility_info?: string | null
          address?: string
          art_types?: Database["public"]["Enums"]["art_type"][] | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          state?: string
          updated_at?: string
          website?: string | null
          zip?: string | null
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
      art_type:
        | "visual_arts"
        | "music"
        | "theater"
        | "dance"
        | "literary"
        | "film"
        | "crafts"
        | "mixed_media"
      cost_type: "free" | "pay_at_door" | "ticketed" | "donation"
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
      art_type: [
        "visual_arts",
        "music",
        "theater",
        "dance",
        "literary",
        "film",
        "crafts",
        "mixed_media",
      ],
      cost_type: ["free", "pay_at_door", "ticketed", "donation"],
    },
  },
} as const
