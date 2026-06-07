import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createToken, getUserData, kv } from '@/lib/db'
import { SignJWT } from 'jose'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Create short-lived magic token
  const magicToken = await new SignJWT({ email, type: 'magic' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET!))

  const url = `${process.env.NEXT_PUBLIC_URL}/api/auth/email?token=${magicToken}`

  await resend.emails.send({
    from: 'Ployhost <login@ployhost.app>',
    to: email,
    subject: 'Your Ployhost login link',
    html: `<p>Click to login to Ployhost:</p><p><a href="${url}">${url}</a></p><p>Expires in 15 minutes.</p>`
  })

  return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.redirect('/')

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET!))
    const email = payload.email as string
    
    // Ensure user exists
    const user = await getUserData(email)
    await kv.set(`user:${email}`, user)

    // Set session cookie
    const session = await createToken(email)
    const res = NextResponse.redirect('/')
    res.cookies.set('ployhost_session', session, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 
    })
    return res
  } catch {
    return NextResponse.redirect('/?error=invalid')
  }
    }
