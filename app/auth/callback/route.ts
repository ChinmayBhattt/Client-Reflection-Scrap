import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/site-config";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Sanitize origin: Safari strictly blocks 0.0.0.0 (WebKitErrorDomain:103)
  let cleanOrigin = origin;
  if (!cleanOrigin || cleanOrigin === "null" || cleanOrigin.includes("0.0.0.0")) {
    cleanOrigin = "http://localhost:3000";
  }

  // If running behind production reverse proxy, use forwarded host
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost && !forwardedHost.includes("localhost") && !forwardedHost.includes("0.0.0.0")) {
    cleanOrigin = `${forwardedProto}://${forwardedHost}`;
  } else if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    cleanOrigin = process.env.NEXT_PUBLIC_APP_URL;
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${cleanOrigin}${next}`);
      }
    }
  }

  // Return the user to an error page or login with message
  return NextResponse.redirect(`${cleanOrigin}/login?error=auth_exchange_failed`);
}
