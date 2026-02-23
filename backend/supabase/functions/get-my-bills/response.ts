import { getCorsHeaders } from "./cors.ts";

export function formatBillsResponse(data: any[], req: Request): Response {
  const itemizedBills = (data ?? []).map((b: any) => {
    const d = b?.data ?? {};
    return {
      title: typeof d.title === "string" ? d.title : "",
      items: Array.isArray(d.items) ? d.items : [],
    };
  });

  return new Response(JSON.stringify(itemizedBills), {
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}

export function createErrorResponse(message: string, status: number, req: Request): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}
