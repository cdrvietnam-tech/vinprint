import type { VinPrintEventName } from "../../lib/analytics";

const allowedEvents = new Set<VinPrintEventName>([
  "ai_design_click",
  "click_ai_mockup_interest",
  "click_phone",
  "click_zalo",
  "load_google_map",
  "open_google_maps",
  "view_pricing",
]);

type AnalyticsPayload = {
  name?: string;
  at?: string;
  detail?: Record<string, string | number | boolean | null>;
};

export async function POST(request: Request) {
  const rawPayload = await request.text();
  if (rawPayload.length > 4096) {
    return new Response(null, { status: 413 });
  }

  let payload: AnalyticsPayload;
  try {
    payload = JSON.parse(rawPayload) as AnalyticsPayload;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!payload.name || !allowedEvents.has(payload.name as VinPrintEventName)) {
    return Response.json({ error: "invalid_event" }, { status: 400 });
  }

  console.log(JSON.stringify({
    type: "vinprint_conversion",
    event: payload.name,
    at: payload.at || new Date().toISOString(),
    detail: payload.detail || {},
  }));

  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
