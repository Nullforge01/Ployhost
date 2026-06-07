export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-12 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> 2026-06-07</p>
      
      <h2>1. Data We Collect</h2>
      <ul>
        <li><strong>Email:</strong> Used for login only. No spam.</li>
        <li><strong>Sites:</strong> ZIP contents you upload. We host them publicly.</li>
        <li><strong>Usage:</strong> Deploy count + bandwidth per month for limits.</li>
        <li><strong>Logs:</strong> Vercel Edge logs for abuse prevention. Deleted after 30 days.</li>
      </ul>

      <h2>2. Cookies</h2>
      <p>One cookie: <code>ployhost_session</code>. HTTP-only. Used to keep you logged in. Expires in 30 days.</p>

      <h2>3. Third Parties</h2>
      <ul>
        <li><strong>Vercel:</strong> Hosting + KV storage. See Vercel Privacy.</li>
        <li><strong>Resend:</strong> Sends login emails. See Resend Privacy.</li>
        <li><strong>EthicalAds:</strong> Privacy-friendly ads. No tracking.</li>
      </ul>

      <h2>4. Your Rights</h2>
      <p>Email nullforgeghost@gmail.com to:</p>
      <ul>
        <li>Delete your account + all sites</li>
        <li>Export your data</li>
        <li>Ask questions</li>
      </ul>

      <h2>5. Children</h2>
      <p>Ployhost is not for users under 13.</p>

      <p>Contact: nullforgeghost@gmail.com</p>
    </div>
  )
}
