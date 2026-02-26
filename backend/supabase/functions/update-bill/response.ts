import { getCorsHeaders } from "./cors.ts";

export function createSuccessResponse(req: Request): Response {
  return new Response(JSON.stringify({ status: 200 }), {
    status: 200,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}

export function createErrorResponse(message: string, status: number, req: Request): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}
