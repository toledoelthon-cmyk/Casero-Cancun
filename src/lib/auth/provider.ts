import type { User } from "@supabase/supabase-js";
import { createSupabaseAuthServerClient } from "@/lib/auth/admin";
import type { UserProfile } from "@/lib/supabase/types";

export type ProviderSession = {
  user: User;
  profile: UserProfile;
};

export type ProviderAccess =
  | { status: "unauthenticated" }
  | { status: "forbidden"; user: User; profile: UserProfile | null }
  | { status: "allowed"; session: ProviderSession };

export async function getProviderAccess(): Promise<ProviderAccess> {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return { status: "unauthenticated" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id,email,full_name,role,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("provider session profile query failed", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
      fullError: profileError,
    });
    return { status: "forbidden", user, profile: null };
  }

  if (profile?.role !== "provider") {
    return { status: "forbidden", user, profile };
  }

  return { status: "allowed", session: { user, profile } };
}
