import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type BusinessViewStats = {
  total: number;
  last7Days: number;
  last30Days: number;
};

export type BusinessViewStatsMap = Record<string, BusinessViewStats>;

const emptyStats: BusinessViewStats = {
  total: 0,
  last7Days: 0,
  last30Days: 0,
};

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function createEmptyStatsMap(businessIds: string[]) {
  return businessIds.reduce<BusinessViewStatsMap>((accumulator, businessId) => {
    accumulator[businessId] = { ...emptyStats };
    return accumulator;
  }, {});
}

export async function getBusinessViewStatsForBusinesses(
  supabase: SupabaseClient<Database>,
  businessIds: string[],
): Promise<BusinessViewStatsMap> {
  const uniqueBusinessIds = Array.from(new Set(businessIds.filter(Boolean)));
  const stats = createEmptyStatsMap(uniqueBusinessIds);

  if (uniqueBusinessIds.length === 0) {
    return stats;
  }

  const last7DaysIso = daysAgoIso(7);
  const last30DaysIso = daysAgoIso(30);

  // Future optimization: replace this with a SQL aggregate view/RPC when traffic grows.
  // For now this keeps panel loading to one RLS-protected query for the whole list.
  const { data, error } = await supabase
    .from("business_profile_views")
    .select("business_id,visited_at")
    .in("business_id", uniqueBusinessIds);

  if (error) {
    console.error("business view stats load error", {
      businessIds: uniqueBusinessIds,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    return stats;
  }

  for (const row of data ?? []) {
    if (!row.business_id || !stats[row.business_id]) {
      continue;
    }

    stats[row.business_id].total += 1;

    if (row.visited_at && row.visited_at >= last30DaysIso) {
      stats[row.business_id].last30Days += 1;
    }

    if (row.visited_at && row.visited_at >= last7DaysIso) {
      stats[row.business_id].last7Days += 1;
    }
  }

  return stats;
}

export async function getBusinessViewStats(
  supabase: SupabaseClient<Database>,
  businessId: string,
): Promise<BusinessViewStats> {
  const stats = await getBusinessViewStatsForBusinesses(supabase, [businessId]);
  return stats[businessId] ?? { ...emptyStats };
}
