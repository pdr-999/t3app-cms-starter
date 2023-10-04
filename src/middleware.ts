import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    //
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        if (pathname.startsWith("/user") && token?.isSuperAdmin === "false") {
          return false;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
      signOut: "/auth/signout",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|img|tutorial).*)",
  ],
};
