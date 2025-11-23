import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ userId: null, userClass: null }, { status: 200 });
  }

  const profileRes = await supabase.from("profiles").select("class").eq("id", user.id).maybeSingle();
  const profileClass = (profileRes.data as { class: string } | null)?.class;
  const metaClass = (user.user_metadata as Record<string, unknown> | null)?.["class"] as string | undefined;
  const userClass = profileClass ?? metaClass ?? "consumer";

  return NextResponse.json({ userId: user.id, userClass }, { status: 200 });
}
