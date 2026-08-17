import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSupabaseSession(request) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value
              );
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isLoginPage =
    pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && user) {
    const dashboardUrl =
      request.nextUrl.clone();

    dashboardUrl.pathname =
      "/admin/dashboard";

    dashboardUrl.search = "";

    return NextResponse.redirect(
      dashboardUrl
    );
  }

  return response;
}