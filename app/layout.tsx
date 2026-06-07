import './globals.css'
import Link from 'next/link'
import Script from 'next/script'

export const metadata = {
  title: 'Ployhost: ZIP → URL. No watermark. No BS.',
  description: 'Upload a ZIP. Get a live site. 3 sites free. No watermark.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script async src="https://media.ethicalads.io/media/client/ethicalads.min.js" />
      </head>
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 p-6 text-sm text-zinc-400">
          <div className="max-w-5xl mx-auto flex justify-between flex-wrap gap-4">
            <span>Made by Wild Lirt Studio © 2026</span>
            <div className="flex gap-6">
              <Link href="/docs" className="hover:text-white">Docs</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <a href="mailto:abuse@ployhost.app" className="hover:text-white">Abuse</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
