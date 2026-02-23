import { corsHeaders } from "./cors.ts";

export function formatBillsResponse(data: any[]): Response {
  const itemizedBills = (data ?? []).map((b: any) => {
    const d = b?.data ?? {};
    return {
      title: typeof d.title === "string" ? d.title : "",
      items: Array.isArray(d.items) ? d.items : [],
    };
  });

  return new Response(JSON.stringify(itemizedBills), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
