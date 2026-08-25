export type UserRole = "employee" | "super_admin";
export type QuestCategory = "exercise"|"posture"|"hydration"|"nutrition"|"sleep"|"mental"|"focus";
export type QuestStatus = "draft"|"scheduled"|"published"|"stopped";
export type PointReasonType = "instant_quest"|"daily_quest"|"adjustment";
export type DeliveryStatus = "pending"|"sent"|"failed";

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: { id: string; name: string; company_code: string; created_at: string };
        Insert: { id?: string; name: string; company_code: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: { id: string; company_id: string; role: UserRole; nickname: string; ranking_opt_in: boolean; notification_enabled: boolean; created_at: string; updated_at: string };
        Insert: { id: string; company_id: string; role?: UserRole; nickname: string; ranking_opt_in?: boolean; notification_enabled?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [{ foreignKeyName: "profiles_company_id_fkey"; columns: ["company_id"]; isOneToOne: false; referencedRelation: "companies"; referencedColumns: ["id"] }];
      };
      quests: {
        Row: { id: string; title: string; description: string; category: QuestCategory; duration_seconds: number; points: number; scheduled_at: string; expires_at: string; notification_title: string; notification_body: string; status: QuestStatus; created_by: string; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; description: string; category: QuestCategory; duration_seconds: number; points: number; scheduled_at: string; expires_at: string; notification_title: string; notification_body: string; status?: QuestStatus; created_by: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["quests"]["Insert"]>;
        Relationships: [{ foreignKeyName: "quests_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      daily_quests: {
        Row: { id: string; title: string; description: string; category: QuestCategory; points: number; sort_order: number; is_active: boolean; created_at: string };
        Insert: { id?: string; title: string; description: string; category: QuestCategory; points: number; sort_order?: number; is_active?: boolean; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["daily_quests"]["Insert"]>;
        Relationships: [];
      };
      quest_completions: {
        Row: { id: string; quest_id: string; user_id: string; company_id: string; completed_at: string };
        Insert: { id?: string; quest_id: string; user_id: string; company_id: string; completed_at?: string };
        Update: Partial<Database["public"]["Tables"]["quest_completions"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "quest_completions_quest_id_fkey"; columns: ["quest_id"]; isOneToOne: false; referencedRelation: "quests"; referencedColumns: ["id"] },
          { foreignKeyName: "quest_completions_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ];
      };
      daily_quest_completions: {
        Row: { id: string; daily_quest_id: string; user_id: string; company_id: string; completed_date: string; completed_at: string };
        Insert: { id?: string; daily_quest_id: string; user_id: string; company_id: string; completed_date: string; completed_at?: string };
        Update: Partial<Database["public"]["Tables"]["daily_quest_completions"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "daily_quest_completions_daily_quest_id_fkey"; columns: ["daily_quest_id"]; isOneToOne: false; referencedRelation: "daily_quests"; referencedColumns: ["id"] },
          { foreignKeyName: "daily_quest_completions_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ];
      };
      points_ledger: {
        Row: { id: string; user_id: string; company_id: string; reason_type: PointReasonType; quest_id: string|null; daily_quest_id: string|null; points: number; is_reversed: boolean; created_at: string };
        Insert: { id?: string; user_id: string; company_id: string; reason_type: PointReasonType; quest_id?: string|null; daily_quest_id?: string|null; points: number; is_reversed?: boolean; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["points_ledger"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "points_ledger_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "points_ledger_quest_id_fkey"; columns: ["quest_id"]; isOneToOne: false; referencedRelation: "quests"; referencedColumns: ["id"] },
          { foreignKeyName: "points_ledger_daily_quest_id_fkey"; columns: ["daily_quest_id"]; isOneToOne: false; referencedRelation: "daily_quests"; referencedColumns: ["id"] }
        ];
      };
      push_subscriptions: {
        Row: { id: string; user_id: string; endpoint: string; p256dh: string; auth: string; created_at: string };
        Insert: { id?: string; user_id: string; endpoint: string; p256dh: string; auth: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
        Relationships: [{ foreignKeyName: "push_subscriptions_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      notification_deliveries: {
        Row: { id: string; quest_id: string; subscription_id: string; status: DeliveryStatus; error_message: string|null; delivered_at: string|null; created_at: string };
        Insert: { id?: string; quest_id: string; subscription_id: string; status?: DeliveryStatus; error_message?: string|null; delivered_at?: string|null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["notification_deliveries"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "notification_deliveries_quest_id_fkey"; columns: ["quest_id"]; isOneToOne: false; referencedRelation: "quests"; referencedColumns: ["id"] },
          { foreignKeyName: "notification_deliveries_subscription_id_fkey"; columns: ["subscription_id"]; isOneToOne: false; referencedRelation: "push_subscriptions"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_company_id_by_code: { Args: { p_company_code: string }; Returns: string|null };
      complete_instant_quest: { Args: { p_quest_id: string }; Returns: { success: boolean; points_awarded: number; message: string }[] };
      complete_daily_quest: { Args: { p_daily_quest_id: string }; Returns: { success: boolean; points_awarded: number; message: string }[] };
      get_weekly_ranking: { Args: Record<PropertyKey, never>; Returns: { rank: number; nickname: string; total_points: number; is_current_user: boolean }[] };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
