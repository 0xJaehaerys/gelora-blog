export default function AdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="gelora-mono mb-8 text-4xl font-bold text-gray-100">GELORA BLOG ADMIN</h1>
        <div className="space-y-4">
          <a href="/admin/simple.html" className="gelora-button inline-block">
            📝 Simple File Manager
          </a>
          <a href="/admin/index.html" className="gelora-button inline-block">
            🎛️ Decap CMS (Production Only)
          </a>
          <p className="text-sm text-gray-500">For local development, use Simple File Manager</p>
        </div>
      </div>
    </div>
  )
}
