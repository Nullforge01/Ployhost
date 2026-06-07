import { NextResponse } from 'next/server'
import { getUser, getUserData, LIMITS } from '@/lib/db'

export async function GET(req: Request) {
  const email = await getUser(req)
  if (!email) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  
  const data = await getUserData(email)
  const month = new Date().toISOString().slice(0,7)
  
  return NextResponse.json({
    email: data.email,
    sites: data.sites,
    limits: LIMITS,
    usage: {
      deploys: data.deploys[month] || 0,
      bw: data.bw[month] || 0
    }
  })
}
