'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => {
      setUser(d.user)
      setLoading(false)
    })
  }, [])

  async function login() {
    setLoading(true)
    const res = await fetch('/api/auth/email', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    if (res.ok) setMsg('Check your email for the login link')
    else setMsg('Error sending email')
    setLoading(false)
  }

  async function logout() {
    await fetch('/api/me', { method: 'POST' })
    setUser(null)
  }

  async function upload(e: any) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setMsg('Deploying...')
    
    const form = new FormData()
    form.append('zip', file)
    const res = await fetch('/api/deploy', { method: 'POST', body: form })
    const data = await res.json()
    
    if (res.ok) {
      setMsg(`Live at ${data.url}`)
      const me = await fetch('/api/me').then(r => r.json())
      setUser(me.user)
    } else {
      setMsg(`Error: ${data.error}`)
    }
    setUploading(false)
    e.target.value = ''
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!user) return (
    <div className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">PloyHost</h1>
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full p-3 border rounded mb-3"
      />
      <button 
        onClick={login} 
        disabled={loading}
        className="w-full bg-black text-white p-3 rounded"
      >
        Send Magic Link
      </button>
      {msg && <p className="mt-4 text-sm text-gray-600">{msg}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">PloyHost</h1>
        <div>
          <span className="mr-4 text-sm">{user.email}</span>
          <button onClick={logout} className="text-sm underline">Logout</button>
        </div>
      </div>
      
      <div className="border-2 border-dashed rounded-lg p-8 mb-8 text-center">
        <input 
          type="file" 
          accept=".zip" 
          onChange={upload} 
          disabled={uploading}
          className="mb-2"
        />
        <p className="text-sm text-gray-500">Upload.zip with index.html. Max 100MB.</p>
        {msg && <p className="mt-4 font-medium">{msg}</p>}
      </div>

      <h2 className="font-bold mb-4">Your Sites ({user.sites.length}/3)</h2>
      {user.sites.length === 0 && <p className="text-gray-500">No sites yet. Upload one above.</p>}
      {user.sites.map((s: any) => (
        <div key={s.name} className="border rounded p-4 mb-2 flex justify-between">
          <div>
            <a href={s.url} target="_blank" className="font-mono text-blue-600 underline">{s.url}</a>
            <p className="text-xs text-gray-500">Created {new Date(s.created).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
           }
