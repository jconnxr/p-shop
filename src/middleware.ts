import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function secret() {
  return process.env.SESSION_SECRET;
}

async function verifyRole(
  token: string | undefined,
  role: "drop" | "admin",
): Promise<boolean> {
  const s = secret();
  if (!s || !token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    return payload.role === role;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const s = secret();
  if (!s) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const ok = await verifyRole(request.cookies.get("admin_session")?.value, "admin");
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product") ||
    pathname.startsWith("/checkout")
  ) {
    const ok = await verifyRole(request.cookies.get("drop_session")?.value, "drop");
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/shop",
    "/shop/:path*",
    "/product/:path*",
    "/checkout/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
