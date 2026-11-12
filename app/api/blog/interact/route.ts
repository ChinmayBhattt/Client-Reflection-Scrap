import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const interactionSchema = z.object({
  postId: z.string().min(1),
  action: z.enum(["like", "unlike", "rate"]),
  rating: z.number().int().min(1).max(5).optional(),
  previousRating: z.number().int().min(0).max(5).optional().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = interactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { postId, action, rating, previousRating } = parsed.data;
    const isSeedId = postId.startsWith("blog-");

    const supabase = await createClient();
    if (!supabase || isSeedId) {
      return NextResponse.json({ ok: true, persisted: false });
    }

    if (action === "like" || action === "unlike") {
      const { data, error } = await supabase.rpc("increment_blog_like", {
        post_id: postId,
        delta: action === "like" ? 1 : -1,
      });

      if (error) {
        return NextResponse.json({ ok: true, persisted: false });
      }

      const row = Array.isArray(data) ? data[0] : data;
      return NextResponse.json({
        ok: true,
        persisted: true,
        likes_count: row?.likes_count,
      });
    }

    if (action === "rate" && rating) {
      const { data, error } = await supabase.rpc("submit_blog_rating", {
        post_id: postId,
        new_rating: rating,
        previous_rating: previousRating ?? 0,
      });

      if (error) {
        return NextResponse.json({ ok: true, persisted: false });
      }

      const row = Array.isArray(data) ? data[0] : data;
      return NextResponse.json({
        ok: true,
        persisted: true,
        rating_sum: row?.rating_sum,
        rating_count: row?.rating_count,
      });
    }

    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Request failed" }, { status: 500 });
  }
}

