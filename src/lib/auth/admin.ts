import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database, UserProfile } from "@/lib/supabase/types";

const missingSupabaseAuthMessage =
  "Supabase Auth is not configured. Expected environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export async function createSupabaseAuthServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(missingSupabaseAuthMessage, {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
    });
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can read cookies but cannot always write them.
        }
      },
    },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  }) as unknown as SupabaseClient<Database>;
}

export type AdminSession = {
  user: User;
  profile: UserProfile;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id,email,full_name,role,created_at,updated_at")
    .eq("id", user.id)
    .single();

  if (process.env.NODE_ENV === "development") {
    console.log("admin session role check", {
      authUserId: user.id,
      authEmail: user.email,
      profileReturned: profile,
      profileError,
    });
  }

  if (profileError) {
    console.error("admin session profile query failed", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
      fullError: profileError,
    });
  }

  if (profileError || profile?.role !== "admin") {
    return null;
  }

  return { user, profile };
}
