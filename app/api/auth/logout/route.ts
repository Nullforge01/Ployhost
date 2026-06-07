import { NextResponse } from 'next/server'

export async function GET() {
  const res = NextResponse.redirect('/')
  res.cookies.delete('ployhost_session')
  return res
}
