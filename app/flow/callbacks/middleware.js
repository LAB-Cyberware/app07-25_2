import { NextResponse } from 'next/server'

export function middleware(request) {
  const referer = request.headers.get('referer')
  const { pathname } = request.nextUrl
  
  const protectedPaths = ['/pago-exitoso', '/confirmacion-pago', '/resultado-pago']
  
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!referer || !referer.includes('https://sandbox.flow.cl/')) {
      return NextResponse.redirect(new URL('/acceso-denegado', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/pago-exitoso/:path*', '/confirmacion-pago/:path*', '/resultado-pago/:path*']
}