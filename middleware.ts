import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_ROUTES = ['/api/auth/email', '/api/health']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  if (!pathname.startsWith('/api/') || PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('ployhost_session')?.value
  if (!token) return NextResponse.json({ error: 'Login required' }, { status: 401 })
  
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET!))
    return NextResponse.next()
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}

export const config = {
  matcher: '/api/:path*'
                       }
