import { createClient } from "@/lib/supabase/server";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  full_name?: string;
  role: "customer" | "admin";
  canWriteBlog: boolean;
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

    const email = user.email || "";
    const isAuthor = isAuthorizedBlogAuthor(email, profile?.role);
    const effectiveRole = isAuthor ? "admin" : ((profile?.role as "customer" | "admin") || "customer");

    return {
      id: user.id,
      email,
      full_name: profile?.full_name || user.user_metadata?.full_name || "",
      role: effectiveRole,
      canWriteBlog: isAuthor,
    };
  } catch {
    return null;
  }
}
