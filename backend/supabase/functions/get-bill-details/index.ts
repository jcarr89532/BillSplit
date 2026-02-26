import { handleCors } from "./cors.ts";
import { verifyAuth } from "./auth.ts";
import { formatBillDetailsResponse, createErrorResponse } from "./response.ts";

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
    const { id: billId } = body;

    if (!billId) {
      return createErrorResponse("Missing bill id", 400, req);
    }

    const { data, error } = await supabase.rpc("get_bill_details", {
      p_bill_id: billId,
    });

    if (error) {
      return createErrorResponse(error.message, 400, req);
    }

    if (!data || data.length === 0) {
      return createErrorResponse("Bill not found", 404, req);
    }

    return formatBillDetailsResponse(data[0], req);
  } catch (error) {
    return createErrorResponse("Invalid request", 400, req);
  }
});
