import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: conversions, error } = await supabase
      .from("conversions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch conversions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversions });
  } catch (error: any) {
    console.error("Conversions fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
