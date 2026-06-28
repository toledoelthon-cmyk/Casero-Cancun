import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type BusinessViewRequestBody = {
  business_id?: unknown;
  visitor_key?: unknown;
  referrer?: unknown;
};

function optionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 500 });
  }

  let body: BusinessViewRequestBody;

  try {
    body = (await request.json()) as BusinessViewRequestBody;
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const businessId = optionalText(body.business_id, 64);

  if (!businessId || !uuidPattern.test(businessId)) {
    return NextResponse.json({ error: "business_id invalido." }, { status: 400 });
  }

  const { data: business, error: businessError } = await supabase
    .from("business_profiles")
    .select("id,status")
    .eq("id", businessId)
    .eq("status", "published")
    .maybeSingle();

  if (businessError) {
    if (process.env.NODE_ENV === "development") {
      console.error("business view profile validation error", { businessId, error: businessError });
    }

    return NextResponse.json({ error: "No pudimos validar la publicacion." }, { status: 500 });
  }

  if (!business) {
    return NextResponse.json({ error: "Publicacion no encontrada o no publicada." }, { status: 404 });
  }

  const visitorKey = optionalText(body.visitor_key, 160);
  const referrer = optionalText(body.referrer, 500) ?? optionalText(request.headers.get("referer"), 500);
  const userAgent = optionalText(request.headers.get("user-agent"), 500);

  const { error: insertError } = await supabase.from("business_profile_views").insert({
    business_id: businessId,
    visitor_key: visitorKey,
    referrer,
    user_agent: userAgent,
  });

  if (insertError) {
    if (process.env.NODE_ENV === "development") {
      console.error("business view insert error", { businessId, visitorKey, referrer, userAgent, error: insertError });
    }

    return NextResponse.json({ error: "No pudimos registrar la visita." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
