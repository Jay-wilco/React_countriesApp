import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// keep your getAuthenticatedUser export as-is (but also guard env vars inside it)
export const getAuthenticatedUser = async (request) => {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No authorization header" };
    }

    const token = authHeader.split(" ")[1];

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return {
        user: null,
        error: "Missing Supabase public environment variables",
      };
    }

    const supabase = createClient(url, anonKey);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { user: null, error: error?.message || "Invalid token" };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};
