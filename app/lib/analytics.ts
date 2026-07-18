export type VinPrintEvent = {
  name: string;
  at: string;
  detail?: Record<string, string | number | boolean | null>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(
  name: string,
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
  window.dispatchEvent(new CustomEvent("vinprint:conversion", { detail: event }));
}
