export type VinPrintEventName =
  | "ai_design_click"
  | "click_phone"
  | "click_zalo"
  | "load_google_map"
  | "open_google_maps"
  | "view_pricing";

export type VinPrintEvent = {
  name: VinPrintEventName;
  at: string;
  detail?: Record<string, string | number | boolean | null>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(
  name: VinPrintEventName,
  detail?: Record<string, string | number | boolean | null>,
) {
  if (typeof window === "undefined") return;

  const event: VinPrintEvent = {
    name,
    at: new Date().toISOString(),
    detail,
  };

  try {
    const previous = JSON.parse(
      window.localStorage.getItem("vinprint_conversion_events") || "[]",
    ) as VinPrintEvent[];
    window.localStorage.setItem(
      "vinprint_conversion_events",
      JSON.stringify([...previous.slice(-99), event]),
    );
  } catch {
    // Tracking must never interrupt the customer journey.
  }

  window.dataLayer?.push({ event: name, ...detail });
  const payload = JSON.stringify(event);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
  } else {
    void fetch("/api/analytics", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => undefined);
  }
  window.dispatchEvent(new CustomEvent("vinprint:conversion", { detail: event }));
}
