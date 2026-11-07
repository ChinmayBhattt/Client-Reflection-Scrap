import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/types/database";

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  full_name?: string;
  role: "customer" | "admin";
} | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      full_name: profile?.full_name || user.user_metadata?.full_name || "",
      role: (profile?.role as "customer" | "admin") || "customer",
    };
  } catch {
    return null;
  }
}
