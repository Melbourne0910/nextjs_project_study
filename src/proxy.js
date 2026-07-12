import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedPaths = ["/chat", "/debug/db"];
const adminPaths = ["/debug/db"];

function matchesPath(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export async function proxy(request) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((path) =>
    matchesPath(pathname, path)
  );
  const isAdminRoute = adminPaths.some((path) =>
    matchesPath(pathname, path)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && token?.isAdmin !== true) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("error", "unauthorized");

    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/debug/db/:path*"],
};
