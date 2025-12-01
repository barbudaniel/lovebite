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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      onboardings: {
        Row: {
          additional_notes: string | null
          address: string | null
          agreed_to_terms: boolean | null
          availability: string | null
          categories: string[] | null
          city: string | null
          contract_pdf_path: string | null
          contract_signed_at: string | null
          country: string | null
          created_at: string
          current_earnings: string | null
          date_of_birth: string | null
          email: string
          experience: string | null
          full_name: string | null
          goals: string | null
          id: string
          id_back_path: string | null
          id_front_path: string | null
          id_number: string | null
          id_type: string | null
          instagram: string | null
          languages: string[] | null
          platforms: string[] | null
          postal_code: string | null
          rejection_reasons: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_with_id_path: string | null
          signature_path: string | null
          signed_contract_path: string | null
          stage_name: string | null
          status: Database["public"]["Enums"]["onboarding_status"]
          submitted_at: string | null
          tiktok: string | null
          twitter: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          address?: string | null
          agreed_to_terms?: boolean | null
          availability?: string | null
          categories?: string[] | null
          city?: string | null
          contract_pdf_path?: string | null
          contract_signed_at?: string | null
          country?: string | null
          created_at?: string
          current_earnings?: string | null
          date_of_birth?: string | null
          email: string
          experience?: string | null
          full_name?: string | null
          goals?: string | null
          id?: string
          id_back_path?: string | null
          id_front_path?: string | null
          id_number?: string | null
          id_type?: string | null
          instagram?: string | null
          languages?: string[] | null
          platforms?: string[] | null
          postal_code?: string | null
          rejection_reasons?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_with_id_path?: string | null
          signature_path?: string | null
          signed_contract_path?: string | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          submitted_at?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          address?: string | null
          agreed_to_terms?: boolean | null
          availability?: string | null
          categories?: string[] | null
          city?: string | null
          contract_pdf_path?: string | null
          contract_signed_at?: string | null
          country?: string | null
          created_at?: string
          current_earnings?: string | null
          date_of_birth?: string | null
          email?: string
          experience?: string | null
          full_name?: string | null
          goals?: string | null
          id?: string
          id_back_path?: string | null
          id_front_path?: string | null
          id_number?: string | null
          id_type?: string | null
          instagram?: string | null
          languages?: string[] | null
          platforms?: string[] | null
          postal_code?: string | null
          rejection_reasons?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_with_id_path?: string | null
          signature_path?: string | null
          signed_contract_path?: string | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          submitted_at?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_onboarding: {
        Args: { p_id: string; p_reviewed_by?: string }
        Returns: boolean
      }
      create_onboarding: { Args: { p_email: string }; Returns: string }
      get_onboarding_for_registration: {
        Args: { p_id: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          status: Database["public"]["Enums"]["onboarding_status"]
        }[]
      }
      get_onboarding_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          approved_count: number
          pending_count: number
          rejected_count: number
          submitted_count: number
          total_count: number
        }[]
      }
      mark_onboarding_email_sent: { Args: { p_id: string }; Returns: boolean }
      reject_onboarding: {
        Args: {
          p_id: string
          p_rejection_reasons: Json
          p_reviewed_by?: string
        }
        Returns: boolean
      }
      start_onboarding: { Args: { p_id: string }; Returns: boolean }
      submit_onboarding: {
        Args: {
          p_additional_notes: string
          p_address: string
          p_availability: string
          p_categories: string[]
          p_city: string
          p_country: string
          p_current_earnings: string
          p_date_of_birth: string
          p_experience: string
          p_full_name: string
          p_goals: string
          p_id: string
          p_id_back_path: string
          p_id_front_path: string
          p_id_number: string
          p_id_type: string
          p_instagram: string
          p_languages: string[]
          p_platforms: string[]
          p_postal_code: string
          p_selfie_with_id_path: string
          p_signature_path: string
          p_signed_contract_path: string
          p_stage_name: string
          p_tiktok: string
          p_twitter: string
        }
        Returns: boolean
      }
    }
    Enums: {
      onboarding_status:
        | "pending"
        | "email_sent"
        | "in_progress"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "resubmit_requested"
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
      onboarding_status: [
        "pending",
        "email_sent",
        "in_progress",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "resubmit_requested",
      ],
    },
  },
} as const

// Helper types for easier usage
export type Onboarding = Tables<"onboardings">
export type OnboardingInsert = TablesInsert<"onboardings">
export type OnboardingUpdate = TablesUpdate<"onboardings">
export type OnboardingStatus = Enums<"onboarding_status">

// Rejection reason type
export interface RejectionReason {
  field: string
  reason: string
}

