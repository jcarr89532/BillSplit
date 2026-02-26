import { handleCors } from "./cors.ts";
import { verifyAuth } from "./auth.ts";
import { createSuccessResponse, createErrorResponse } from "./response.ts";

// @ts-ignore - Deno is available in Supabase Edge Functions runtime
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const authResult = await verifyAuth(req);
  if ("error" in authResult) {
    return authResult.error;
  }

  const { user, supabase } = authResult;

  try {
    const body = await req.json();
    const { id, title, items, tax, subtotal, total } = body;

    if (!id) {
      return createErrorResponse("Missing bill id", 400, req);
    }

    const { data, error } = await supabase.rpc("update_bill", {
      p_bill_id: id,
      p_title: title || "",
      p_items: items || [],
      p_tax: tax || 0,
      p_subtotal: subtotal || 0,
      p_total: total || 0,
    });

    if (error) {
      return createErrorResponse(error.message, 400, req);
    }

    return createSuccessResponse(req);
  } catch (error) {
    return createErrorResponse("Invalid request body", 400, req);
  }
});
