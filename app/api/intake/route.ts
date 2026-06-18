import { NextResponse } from "next/server";
import { normalizeIntakePayload } from "@/lib/module-1/intake";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "El cuerpo debe venir como JSON válido." },
      { status: 400 },
    );
  }

  if (!rawPayload || typeof rawPayload !== "object") {
    return NextResponse.json(
      { ok: false, error: "No llegó un intake válido para guardar." },
      { status: 400 },
    );
  }

  const payload = normalizeIntakePayload(rawPayload as Record<string, string | string[] | undefined>);
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      stored: false,
      reason: "supabase-not-configured",
    });
  }

  const { error } = await supabase.from("intake_sessions").insert({
    stage: payload.stage,
    care_setting: payload.care_setting,
    need: payload.needs[0],
    needs: payload.needs,
    town_slug: payload.town,
    notes: payload.notes ?? null,
    source: "web_intake",
  });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo guardar el intake.",
        details: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
