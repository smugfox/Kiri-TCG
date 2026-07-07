import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtected = createRouteMatcher(["/portfolio(.*)", "/watchlist(.*)", "/alerts(.*)", "/settings(.*)"]);

const authMiddleware = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isProtected(request) && !(await convexAuth.isAuthenticated())) {
    const url = new URL(request.url);
    return nextjsMiddlewareRedirect(request, `/signin?next=${encodeURIComponent(url.pathname)}`);
  }
});

/** Auth enforcement activates once the Convex deployment is provisioned. */
export default function middleware(request: Parameters<typeof authMiddleware>[0], event: Parameters<typeof authMiddleware>[1]) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return;
  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
