import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navigation />
      <main className="pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
      
      <footer className="py-8 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-xs">
          Built on Cloudflare Pages • {new Date().getFullYear()} AI Framework
        </div>
      </footer>
    </div>
  )
}
