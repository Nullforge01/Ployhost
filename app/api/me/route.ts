import { NextResponse } from 'next/server'
import { getUser, getUserData } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  const email = await getUser()
  if (!email) return NextResponse.json({ user: null })
  
  const user = await getUserData(email)
  return NextResponse.json({ user })
}

export async function POST(req: Request) {
  const email = await getUser()
  if (!email) return NextResponse.json({ error: 'Login required' }, { status: 401 })
  
  // For logout
  return NextResponse.json({ ok: true }, {
    headers: { 'Set-Cookie': 'token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax' }
  })
}
