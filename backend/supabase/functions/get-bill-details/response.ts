import { getCorsHeaders } from "./cors.ts";

export function formatBillDetailsResponse(data: any, req: Request): Response {
  const bill = {
    id: data.id,
    title: data.title || "",
    items: Array.isArray(data.items) ? data.items : [],
    tax: typeof data.tax === "number" ? data.tax : 0,
    subtotal: typeof data.subtotal === "number" ? data.subtotal : 0,
    total: typeof data.total === "number" ? data.total : 0,
  };

  return new Response(JSON.stringify(bill), {
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}

export function createErrorResponse(message: string, status: number, req: Request): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}
