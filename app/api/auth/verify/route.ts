import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  
  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=missing_token`)
  }

  const email = await verifyToken(token)
  
  if (!email) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=invalid_token`)
  }

  cookies().set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/dashboard`)
}
