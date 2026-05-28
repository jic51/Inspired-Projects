import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q");

  let query = supabase
    .from("videos")
    .select("id, title, description, thumbnail_url, view_count, created_at, creator_id")
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(24);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ videos: data });
}
