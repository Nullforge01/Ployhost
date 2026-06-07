export default function Docs() {
  return (
    <div className="max-w-3xl mx-auto p-12 prose prose-invert">
      <h1>Ployhost Docs</h1>
      <h2>How it works</h2>
      <ol>
        <li>Zip your static site: <code>index.html</code> must be in the root</li>
        <li>Login with email - no password</li>
        <li>Drag + drop ZIP. Get instant <code>*.ployhost.app</code> URL</li>
      </ol>
      
      <h2>Limits - Free Plan</h2>
      <ul>
        <li><strong>3 sites</strong> per account</li>
        <li><strong>12 deploys</strong> per month</li>
        <li><strong>20 GB bandwidth</strong> per month</li>
        <li><strong>100 MB</strong> per site</li>
      </ul>

      <h2>What we don't support</h2>
      <ul>
        <li>Server-side code: PHP, Node, Python</li>
        <li>Databases</li>
        <li>Build steps: Next.js, React apps need to be pre-built</li>
      </ul>

      <h2>Abuse</h2>
      <p>Phishing, malware, crypto miners, and NSFW get instant ban. See <a href="/terms">Terms</a>.</p>
    </div>
  )
}
