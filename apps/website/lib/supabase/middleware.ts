import { createServerClient } from "@supabase/ssr";
import { createLogger } from "@ludecker/utils";
import { NextResponse, type NextRequest } from "next/server";

const log = createLogger("middleware:session");

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function nextResponse() {
  return NextResponse.next();
}

function applyCookies(
  response: NextResponse,
  cookiesToSet: CookieToSet[],
) {
  cookiesToSet.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options),
  );
  return response;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  log.debug("updateSession", "start", { pathname });

  let supabaseResponse = nextResponse();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log.error("updateSession", "Missing Supabase public credentials", {
      pathname,
      hasUrl: Boolean(supabaseUrl),
      hasKey: Boolean(supabaseKey),
    });
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = nextResponse();
        applyCookies(supabaseResponse, cookiesToSet);
      },
    },
  });

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      log.warn("updateSession", "getUser failed", {
        pathname,
        message: error.message,
      });
    }

    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginRoute = pathname === "/admin/login";

    if (isAdminRoute && !isLoginRoute && !user) {
      log.debug("updateSession", "redirect unauthenticated admin request", {
        pathname,
      });
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (isLoginRoute && user) {
      log.debug("updateSession", "redirect authenticated user to dashboard", {
        pathname,
      });
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    log.debug("updateSession", "success", { pathname, authenticated: Boolean(user) });
    return supabaseResponse;
  } catch (error) {
    log.error("updateSession", "unexpected failure", {
      pathname,
      message: error instanceof Error ? error.message : "unknown",
    });
    return supabaseResponse;
  }
}
