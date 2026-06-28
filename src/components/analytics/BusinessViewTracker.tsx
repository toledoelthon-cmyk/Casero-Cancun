"use client";

import { useEffect } from "react";

const viewThrottleMs = 6 * 60 * 60 * 1000;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getVisitorKey() {
  const storageKey = "casero_visitor_key";
  const existing = window.localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const generated = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(storageKey, generated);
  return generated;
}

export function BusinessViewTracker({ businessId }: { businessId: string }) {
  useEffect(() => {
    if (!uuidPattern.test(businessId)) {
      return;
    }

    try {
      const storageKey = `casero_viewed_business_${businessId}`;
      const lastViewedAt = Number(window.localStorage.getItem(storageKey) ?? "0");
      const now = Date.now();

      if (Number.isFinite(lastViewedAt) && now - lastViewedAt < viewThrottleMs) {
        return;
      }

      window.localStorage.setItem(storageKey, String(now));

      void fetch("/api/business-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          visitor_key: getVisitorKey(),
          referrer: document.referrer || null,
        }),
        keepalive: true,
      }).catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("business view tracker request failed", { businessId, error });
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("business view tracker failed", { businessId, error });
      }
    }
  }, [businessId]);

  return null;
}
