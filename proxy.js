import { updateSupabaseSession } from "@/lib/supabaseProxy";

export async function proxy(request) {
  return await updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};