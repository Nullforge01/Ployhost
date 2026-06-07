import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createToken } from '@/lib/auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()
  
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const token = await createToken(email)
  const url = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`

  try {
    await resend.emails.send({
      from: 'PloyHost <auth@ployhost.app>',
      to: email,
      subject: 'Your PloyHost login link',
      html: `
        <h2>Sign in to PloyHost</h2>
        <p>Click below to sign in. Link expires in 10 minutes.</p>
        <a href="${url}" style="background:#000;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block">Sign in to PloyHost</a>
        <p style="color:#666;font-size:12px;margin-top:20px">If you didn't request this, ignore this email.</p>
      `
    })
    
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
