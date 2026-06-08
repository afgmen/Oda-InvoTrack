export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_employees: {
        Row: {
          company_id: string;
          created_at: string;
          email: string | null;
          id: string;
          is_active: boolean;
          name: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_employees_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      company_invoice_profiles: {
        Row: {
          company_id: string;
          created_at: string;
          invoice_email: string | null;
          legal_name: string;
          registered_address: string;
          tax_code: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          invoice_email?: string | null;
          legal_name: string;
          registered_address: string;
          tax_code: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          invoice_email?: string | null;
          legal_name?: string;
          registered_address?: string;
          tax_code?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_invoice_profiles_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: true;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      company_invoice_qrs: {
        Row: {
          assigned_at: string | null;
          assigned_email: string | null;
          assigned_employee_id: string | null;
          assigned_name: string | null;
          assigned_phone: string | null;
          company_id: string;
          created_at: string;
          display_code: string;
          distribution_method: Database["public"]["Enums"]["qr_distribution_method"];
          email_sent_at: string | null;
          id: string;
          revoked_at: string | null;
          status: Database["public"]["Enums"]["company_invoice_qr_status"];
          token_hash: string;
          updated_at: string;
        };
        Insert: {
          assigned_at?: string | null;
          assigned_email?: string | null;
          assigned_employee_id?: string | null;
          assigned_name?: string | null;
          assigned_phone?: string | null;
          company_id: string;
          created_at?: string;
          display_code: string;
          distribution_method?: Database["public"]["Enums"]["qr_distribution_method"];
          email_sent_at?: string | null;
          id?: string;
          revoked_at?: string | null;
          status: Database["public"]["Enums"]["company_invoice_qr_status"];
          token_hash: string;
          updated_at?: string;
        };
        Update: {
          assigned_at?: string | null;
          assigned_email?: string | null;
          assigned_employee_id?: string | null;
          assigned_name?: string | null;
          assigned_phone?: string | null;
          company_id?: string;
          created_at?: string;
          display_code?: string;
          distribution_method?: Database["public"]["Enums"]["qr_distribution_method"];
          email_sent_at?: string | null;
          id?: string;
          revoked_at?: string | null;
          status?: Database["public"]["Enums"]["company_invoice_qr_status"];
          token_hash?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_invoice_qrs_assigned_employee_id_fkey";
            columns: ["assigned_employee_id"];
            isOneToOne: false;
            referencedRelation: "company_employees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_invoice_qrs_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      company_memberships: {
        Row: {
          company_id: string;
          created_at: string;
          created_by: string | null;
          role: Database["public"]["Enums"]["company_role"];
          user_id: string;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          created_by?: string | null;
          role: Database["public"]["Enums"]["company_role"];
          user_id: string;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          created_by?: string | null;
          role?: Database["public"]["Enums"]["company_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_memberships_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_request_events: {
        Row: {
          created_at: string;
          created_by_type: Database["public"]["Enums"]["request_event_actor"];
          created_by_user_id: string | null;
          event_payload: Json;
          event_type: string;
          id: string;
          invoice_request_id: string;
        };
        Insert: {
          created_at?: string;
          created_by_type: Database["public"]["Enums"]["request_event_actor"];
          created_by_user_id?: string | null;
          event_payload?: Json;
          event_type: string;
          id?: string;
          invoice_request_id: string;
        };
        Update: {
          created_at?: string;
          created_by_type?: Database["public"]["Enums"]["request_event_actor"];
          created_by_user_id?: string | null;
          event_payload?: Json;
          event_type?: string;
          id?: string;
          invoice_request_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_request_events_invoice_request_id_fkey";
            columns: ["invoice_request_id"];
            isOneToOne: false;
            referencedRelation: "invoice_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_requests: {
        Row: {
          approximate_location: string | null;
          assigned_email: string | null;
          assigned_employee_id: string | null;
          assigned_employee_name: string | null;
          company_address: string;
          company_id: string;
          company_invoice_email: string | null;
          company_name: string;
          company_tax_code: string;
          created_at: string;
          gps_latitude: number | null;
          gps_longitude: number | null;
          id: string;
          idempotency_key: string;
          invoice_request_card_url: string | null;
          ip_address: unknown;
          qr_assignment_status: Database["public"]["Enums"]["company_invoice_qr_status"];
          qr_display_code: string;
          qr_id: string;
          receipt_amount: number | null;
          receipt_photo_path: string | null;
          request_code: string;
          requested_at: string;
          status: Database["public"]["Enums"]["invoice_request_status"];
          updated_at: string;
          upload_token_hash: string;
          user_agent: string;
          visible_until: string;
        };
        Insert: {
          approximate_location?: string | null;
          assigned_email?: string | null;
          assigned_employee_id?: string | null;
          assigned_employee_name?: string | null;
          company_address: string;
          company_id: string;
          company_invoice_email?: string | null;
          company_name: string;
          company_tax_code: string;
          created_at?: string;
          gps_latitude?: number | null;
          gps_longitude?: number | null;
          id?: string;
          idempotency_key: string;
          invoice_request_card_url?: string | null;
          ip_address: unknown;
          qr_assignment_status: Database["public"]["Enums"]["company_invoice_qr_status"];
          qr_display_code: string;
          qr_id: string;
          receipt_amount?: number | null;
          receipt_photo_path?: string | null;
          request_code: string;
          requested_at?: string;
          status?: Database["public"]["Enums"]["invoice_request_status"];
          updated_at?: string;
          upload_token_hash: string;
          user_agent: string;
          visible_until: string;
        };
        Update: {
          approximate_location?: string | null;
          assigned_email?: string | null;
          assigned_employee_id?: string | null;
          assigned_employee_name?: string | null;
          company_address?: string;
          company_id?: string;
          company_invoice_email?: string | null;
          company_name?: string;
          company_tax_code?: string;
          created_at?: string;
          gps_latitude?: number | null;
          gps_longitude?: number | null;
          id?: string;
          idempotency_key?: string;
          invoice_request_card_url?: string | null;
          ip_address?: unknown;
          qr_assignment_status?: Database["public"]["Enums"]["company_invoice_qr_status"];
          qr_display_code?: string;
          qr_id?: string;
          receipt_amount?: number | null;
          receipt_photo_path?: string | null;
          request_code?: string;
          requested_at?: string;
          status?: Database["public"]["Enums"]["invoice_request_status"];
          updated_at?: string;
          upload_token_hash?: string;
          user_agent?: string;
          visible_until?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_requests_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_requests_qr_id_fkey";
            columns: ["qr_id"];
            isOneToOne: false;
            referencedRelation: "company_invoice_qrs";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_uploads: {
        Row: {
          content_type: string | null;
          created_at: string;
          file_size_bytes: number | null;
          file_type: Database["public"]["Enums"]["invoice_upload_type"];
          id: string;
          invoice_link: string | null;
          invoice_request_id: string;
          note: string | null;
          original_filename: string | null;
          storage_path: string | null;
          uploaded_at: string;
          uploaded_by_type: Database["public"]["Enums"]["invoice_upload_actor"];
          uploaded_by_user_id: string | null;
        };
        Insert: {
          content_type?: string | null;
          created_at?: string;
          file_size_bytes?: number | null;
          file_type: Database["public"]["Enums"]["invoice_upload_type"];
          id?: string;
          invoice_link?: string | null;
          invoice_request_id: string;
          note?: string | null;
          original_filename?: string | null;
          storage_path?: string | null;
          uploaded_at?: string;
          uploaded_by_type: Database["public"]["Enums"]["invoice_upload_actor"];
          uploaded_by_user_id?: string | null;
        };
        Update: {
          content_type?: string | null;
          created_at?: string;
          file_size_bytes?: number | null;
          file_type?: Database["public"]["Enums"]["invoice_upload_type"];
          id?: string;
          invoice_link?: string | null;
          invoice_request_id?: string;
          note?: string | null;
          original_filename?: string | null;
          storage_path?: string | null;
          uploaded_at?: string;
          uploaded_by_type?: Database["public"]["Enums"]["invoice_upload_actor"];
          uploaded_by_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_uploads_invoice_request_id_fkey";
            columns: ["invoice_request_id"];
            isOneToOne: false;
            referencedRelation: "invoice_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_transition_request_status: {
        Args: {
          from_status: Database["public"]["Enums"]["invoice_request_status"];
          to_status: Database["public"]["Enums"]["invoice_request_status"];
        };
        Returns: boolean;
      };
      has_company_role: {
        Args: {
          required_role: Database["public"]["Enums"]["company_role"];
          target_company_id: string;
        };
        Returns: boolean;
      };
      is_company_member: {
        Args: { target_company_id: string };
        Returns: boolean;
      };
      is_terminal_request_status: {
        Args: {
          target_status: Database["public"]["Enums"]["invoice_request_status"];
        };
        Returns: boolean;
      };
      requests_eligible_for_purge: {
        Args: { as_of?: string };
        Returns: {
          approximate_location: string | null;
          assigned_email: string | null;
          assigned_employee_id: string | null;
          assigned_employee_name: string | null;
          company_address: string;
          company_id: string;
          company_invoice_email: string | null;
          company_name: string;
          company_tax_code: string;
          created_at: string;
          gps_latitude: number | null;
          gps_longitude: number | null;
          id: string;
          idempotency_key: string;
          invoice_request_card_url: string | null;
          ip_address: unknown;
          qr_assignment_status: Database["public"]["Enums"]["company_invoice_qr_status"];
          qr_display_code: string;
          qr_id: string;
          receipt_amount: number | null;
          receipt_photo_path: string | null;
          request_code: string;
          requested_at: string;
          status: Database["public"]["Enums"]["invoice_request_status"];
          updated_at: string;
          upload_token_hash: string;
          user_agent: string;
          visible_until: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "invoice_requests";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
    };
    Enums: {
      company_invoice_qr_status:
        | "active_unassigned"
        | "active_assigned"
        | "claim_pending"
        | "revoked";
      company_role: "company_admin" | "company_accounting";
      invoice_request_status:
        | "request_created"
        | "waiting_invoice"
        | "invoice_uploaded"
        | "need_follow_up_overdue"
        | "asked_assigned_employee"
        | "need_qr_owner_identification"
        | "resolved"
        | "rejected"
        | "cancelled";
      invoice_upload_actor: "restaurant" | "company_accounting" | "system";
      invoice_upload_type: "pdf" | "xml" | "image" | "link";
      qr_distribution_method: "manual" | "email" | "import";
      request_event_actor:
        | "system"
        | "qr_holder"
        | "company_accounting"
        | "restaurant";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      company_invoice_qr_status: [
        "active_unassigned",
        "active_assigned",
        "claim_pending",
        "revoked",
      ],
      company_role: ["company_admin", "company_accounting"],
      invoice_request_status: [
        "request_created",
        "waiting_invoice",
        "invoice_uploaded",
        "need_follow_up_overdue",
        "asked_assigned_employee",
        "need_qr_owner_identification",
        "resolved",
        "rejected",
        "cancelled",
      ],
      invoice_upload_actor: ["restaurant", "company_accounting", "system"],
      invoice_upload_type: ["pdf", "xml", "image", "link"],
      qr_distribution_method: ["manual", "email", "import"],
      request_event_actor: [
        "system",
        "qr_holder",
        "company_accounting",
        "restaurant",
      ],
    },
  },
} as const;
