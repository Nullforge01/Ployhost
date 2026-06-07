'use client'
import { useState, useEffect } from 'react'

type User = { email: string, sites: any[], deploys: any, bw: any }

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    try {
      const res = await fetch('/api/me')
      if (res.ok) setUser(await res.json())
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function sendMagicLink() {
    setMsg('Sending link...')
    try {
      const res = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email })
      })
      setMsg(res.ok ? 'Check your email for the login link' : 'Error sending link')
    } catch (e) {
      setMsg('Error sending link')
    }
  }

  async function logout() {
    await fetch('/api/auth/logout')
    setUser(null)
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>

  if (!user) return (
    <div className="max-w-md mx-auto p-12">
      <h1 className="text-3xl font-bold mb-2">Ployhost</h1>
      <p className="text-zinc-400 mb-8">ZIP → URL. No watermark. No BS.</p>
      <input 
        type="email" 
        placeholder="your@email.com"
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 mb-4"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button 
        onClick={sendMagicLink}
        className="w-full p-3 rounded bg-blue-600 hover:bg-blue-500 font-medium"
      >
        Send Magic Link
      </button>
      {msg && <p className="mt-4 text-sm text-zinc-400">{msg}</p>}
      <div data-ea-publisher="ployhost" data-ea-type="text" className="mt-12"></div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Ployhost</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-zinc-400">{user.email}</span>
          <button onClick={logout} className="text-sm text-red-400">Logout</button>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center mb-8">
        <p className="text-xl mb-2">Drop your ZIP here</p>
        <p className="text-zinc-500 text-sm">3 sites free. No watermark.</p>
        <input type="file" accept=".zip" className="mt-6" />
      </div>

      <h2 className="text-lg font-semibold mb-4">Your Sites ({user.sites.length}/3)</h2>
      {user.sites.length === 0 ? (
        <p className="text-zinc-500">No sites yet. Upload a ZIP to start.</p>
      ) : (
        <div className="space-y-3">
          {user.sites.map((s: any) => (
            <div key={s.name} className="flex justify-between items-center p-4 bg-zinc-900 rounded">
              <a href={s.url} target="_blank" className="text-blue-400 hover:underline">{s.url}</a>
              <button className="text-red-400 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
      
      <div data-ea-publisher="ployhost" data-ea-type="text" className="mt-12"></div>
    </div>
  )
}
