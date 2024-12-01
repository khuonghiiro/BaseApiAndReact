import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export const config = {
    matcher: '/admin/:path*',
  }
export function middleware(request: NextRequest) {
  let oauth = request.cookies.get('oauth')
  if (!oauth)
  return NextResponse.redirect(new URL('/login', request.url))
}