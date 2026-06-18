import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getLiveDoulaResources, LIVE_DOULAS_CACHE_TAG } from "@/lib/module-1/live-doulas";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  if (!configuredSecret) return true;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${configuredSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const doulas = await getLiveDoulaResources({ forceFresh: true });
  if (!doulas) {
    return NextResponse.json(
      { ok: false, error: "No se pudo refrescar la hoja viva de doulas." },
      { status: 502 },
    );
  }

  revalidateTag(LIVE_DOULAS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/directorio");
  revalidatePath("/resultados");

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
    count: doulas.length,
    source: "live-doulas-sheet",
  });
}
