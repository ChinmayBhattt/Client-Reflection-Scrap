import { cookies } from "next/headers";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";

export const getCurrentUser = cache(async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  full_name?: string;
  role: "customer" | "admin";
  canWriteBlog: boolean;
} | null> {
  try {
    const cookieStore = cookies();
    const hasAuthCookie = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
    if (!hasAuthCookie) return null;

    const supabase = await createClient();
    if (!supabase) return null;

    // Strict 2.5s timeout on auth check so it never blocks or hangs the whole page render
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase auth timeout")), 2500)
    );

    const authPromise = supabase.auth.getUser();

    const authRes = (await Promise.race([authPromise, timeoutPromise])) as any;
    const user = authRes?.data?.user;
    const error = authRes?.error;

    if (error || !user) return null;

    // Fetch profile with 1.8s timeout
    let profile: { full_name?: string; role?: string } | null = null;
    try {
      const profilePromise = supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      const profileTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Profile timeout")), 1800)
      );
      const res = (await Promise.race([profilePromise, profileTimeout])) as any;
      profile = res?.data || null;
    } catch {
      // Profile fetch timed out or failed, fallback to user metadata
    }

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
});
