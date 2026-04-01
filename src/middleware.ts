import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'r1-auth-token'
const PUBLIC_PATHS = ['/login', '/_next/', '/favicon.ico', '/public/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get(AUTH_COOKIE)?.value || request.headers.get('r1-auth-token')

  // Let public paths pass
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    // If authed, don't let them go to /login again
    if (pathname === '/login' && authToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Check auth
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    // loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) -> protected by middleware though
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
