export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="mb-8 border-b py-4">
        <nav className="mx-auto flex max-w-4xl gap-4 px-4">
          <a href="/" className="font-semibold">Home</a>
          <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          {/* Link to dashboard — crosses into a different layout */}
          <a href="/dashboard" className="ml-auto text-blue-600 hover:text-blue-800">
            Dashboard →
          </a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="mt-8 border-t py-4 text-gray-500 text-sm">
        © 2026 Next.js Foundations
      </footer>
    </div>
  )
}