import { kv } from '@vercel/kv'
import { jwtVerify, SignJWT } from 'jose'

export const LIMITS = { sites: 3, deploys: 12, bw: 20, storage: 100 }
const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

export type UserData = {
  email: string
  sites: { name: string, url: string, created: number }[]
  deploys: { [month: string]: number }
  bw: { [month: string]: number }
  created: number
}

export async function createToken(email: string) {
  return await new SignJWT({ email })
   .setProtectedHeader({ alg: 'HS256' })
   .setExpirationTime('30d')
   .sign(secret)
}

export async function getUser(req: Request) {
  const token = req.headers.get('cookie')?.split('ployhost_session=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.email as string
  } catch { return null }
}

export async function getUserData(email: string): Promise<UserData> {
  const data = await kv.get<UserData>(`user:${email}`)
  return data || { email, sites: [], deploys: {}, bw: {}, created: Date.now() }
}

export async function canDeploy(email: string) {
  const user = await getUserData(email)
  const month = new Date().toISOString().slice(0,7)
  const used = user.deploys[month] || 0
  if (user.sites.length >= LIMITS.sites) return { ok: false, reason: 'Site limit reached' }
  if (used >= LIMITS.deploys) return { ok: false, reason: 'Deploy limit reached' }
  return { ok: true }
}

export async function trackDeploy(email: string) {
  const user = await getUserData(email)
  const month = new Date().toISOString().slice(0,7)
  user.deploys[month] = (user.deploys[month] || 0) + 1
  await kv.set(`user:${email}`, user)
}

export async function checkBandwidth(email: string, bytes: number) {
  const user = await getUserData(email)
  const month = new Date().toISOString().slice(0,7)
  const used = (user.bw[month] || 0) + bytes
  if (used > LIMITS.bw * 1e9) return false
  user.bw[month] = used
  await kv.set(`user:${email}`, user)
  return true
}
