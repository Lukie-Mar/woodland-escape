import { updateSupabaseSession } from "@/lib/supabaseProxy";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Login page does not need authentication
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  return await updateSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};