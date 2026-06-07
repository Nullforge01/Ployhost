import { NextResponse } from 'next/server'
import { getUser, getUserData, canDeploy, trackDeploy, kv } from '@/lib/db'
import { put, del } from '@vercel/blob'
import JSZip from 'jszip'
import { nanoid } from 'nanoid'

export const runtime = 'edge'

export async function POST(req: Request) {
  const email = await getUser(req)
  if (!email) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const check = await canDeploy(email)
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 403 })

  const form = await req.formData()
  const file = form.get('zip') as File
  if (!file) {
    return NextResponse.json({ error: 'Upload a .zip file' }, { status: 400 })
  }
  if (file.size > 100 * 1024) {
    return NextResponse.json({ error: 'ZIP too large. 100 MB max' }, { status: 400 })
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const hasIndex = Object.keys(zip.files).some(f => f === 'index.html' || f.endsWith('/index.html'))
  if (!hasIndex) return NextResponse.json({ error: 'ZIP must contain index.html' }, { status: 400 })

  const siteId = nanoid(8)
  const baseUrl = `https://${siteId}.ployhost.app`
  const user = await getUserData(email)
  const uploads: Promise<any>[] = []

  for (const [path, zipFile] of Object.entries(zip.files)) {
    if (zipFile.dir) continue
    const content = await zipFile.async('blob')
    const key = `sites/${email}/${siteId}/${path}`
    uploads.push(put(key, content, { access: 'public', addRandomSuffix: false }))
  }

  await Promise.all(uploads)
  user.sites.push({ name: siteId, url: baseUrl, created: Date.now() })
  await trackDeploy(email)
  await kv.set(`user:${email}`, user)

  return NextResponse.json({ url: baseUrl })
}

export async function DELETE(req: Request) {
  const email = await getUser(req)
  if (!email) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { siteId } = await req.json()
  const user = await getUserData(email)
  const site = user.sites.find((s: any) => s.name === siteId)
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 })

  await del(`sites/${email}/${siteId}/`, { recursive: true })
  user.sites = user.sites.filter((s: any) => s.name !== siteId)
  await kv.set(`user:${email}`, user)

  return NextResponse.json({ ok: true })
    }
