import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ActivityLog {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  performed_by: string | null;
  performed_by_email: string;
  changes: Record<string, unknown>;
  created_at: string;
}

export const useActivityLog = () => {
  const { user, profile } = useAuth();

  const logActivity = async (
    actionType: "create" | "update" | "delete",
    entityId: string,
    entityName: string,
    changes: Record<string, unknown> = {}
  ) => {
    if (!user) return;
    await supabase.from("activity_logs").insert([{
      action_type: actionType,
      entity_type: "family_member" as string,
      entity_id: entityId,
      entity_name: entityName,
      performed_by: user.id,
      performed_by_email: profile?.email || user.email || "",
      changes: changes as any,
    }]);
  };

  const fetchLogs = async (filters?: {
    memberId?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ActivityLog[]> => {
    let query = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.memberId) query = query.eq("entity_id", filters.memberId);
    if (filters?.userId) query = query.eq("performed_by", filters.userId);
    if (filters?.dateFrom) query = query.gte("created_at", filters.dateFrom);
    if (filters?.dateTo) query = query.lte("created_at", filters.dateTo);

    const { data } = await query;
    return (data || []) as ActivityLog[];
  };

  return { logActivity, fetchLogs };
};
