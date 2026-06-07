import { kv } from '@vercel/kv'
import { verifyToken } from './auth'
import { cookies } from 'next/headers'

export { kv }

export async function getUser(req?: Request): Promise<string | null> {
  const token = cookies().get('token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export async function getUserData(email: string) {
  const user = await kv.get(`user:${email}`)
  if (user) return user
  
  const newUser = {
    email,
    plan: 'free',
    sites: [],
    deploys: [],
    created: Date.now()
  }
  await kv.set(`user:${email}`, newUser)
  return newUser
}

export async function canDeploy(email: string) {
  const user = await getUserData(email)
  const now = Date.now()
  const dayAgo = now - 24 * 60 * 60 * 1000
  
  const deploysToday = user.deploys.filter((t: number) => t > dayAgo).length
  
  if (user.plan === 'free' && deploysToday >= 5) {
    return { ok: false, reason: 'Daily limit reached. 5 deploys/day on Free plan.' }
  }
  if (user.sites.length >= 3 && user.plan === 'free') {
    return { ok: false, reason: 'Site limit reached. 3 sites max on Free plan.' }
  }
  
  return { ok: true }
}

export async function trackDeploy(email: string) {
  const user = await getUserData(email)
  user.deploys.push(Date.now())
  await kv.set(`user:${email}`, user)
}
