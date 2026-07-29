import { NextResponse } from "next/server";

function getRequestId(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  for (const key of ["requestId", "id", "solicitudId", "leadId"]) {
    if (key in body && typeof body[key as keyof typeof body] === "string") {
      return body[key as keyof typeof body] as string;
    }
  }

  return undefined;
}

function getSafeErrorMessage(body: unknown) {
  if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
    return body.error;
  }

  if (typeof body === "object" && body !== null && "message" in body && typeof body.message === "string") {
    return body.message;
  }

  return "azc_unavailable";
}

export async function POST(request: Request) {
  const azcUrl = process.env.AZC_CASERO_REQUESTS_URL;
  const apiKey = process.env.AZC_PUBLIC_LEADS_API_KEY;

  if (!azcUrl || !apiKey) {
    console.error("AZC Casero proxy error", {
      status: 500,
      message: "missing_server_env",
    });

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
      console.error("AZC Casero proxy error", {
        status: response.status,
        message: getSafeErrorMessage(body),
      });

      return NextResponse.json({ ok: false, error: "azc_unavailable" }, { status: response.status });
    }

    return NextResponse.json({ ok: true, requestId: getRequestId(body) });
  } catch (error) {
    console.error("AZC Casero proxy error", {
      status: 502,
      message: error instanceof Error ? error.message : "fetch_failed",
    });

    return NextResponse.json({ ok: false, error: "azc_unavailable" }, { status: 502 });
  }
}