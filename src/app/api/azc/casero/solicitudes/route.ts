import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const azcUrl = process.env.AZC_CASERO_REQUESTS_URL;
  const apiKey = process.env.AZC_PUBLIC_LEADS_API_KEY;

  if (!azcUrl || !apiKey) {
    return NextResponse.json({ ok: false, error: "azc_not_configured" }, { status: 500 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  try {
    const response = await fetch(azcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-azc-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "azc_unavailable" }, { status: response.status });
    }

    const requestId =
      typeof body === "object" && body !== null && "requestId" in body && typeof body.requestId === "string"
        ? body.requestId
        : undefined;

    return NextResponse.json({ ok: true, requestId });
  } catch {
    return NextResponse.json({ ok: false, error: "azc_unavailable" }, { status: 502 });
  }
}
