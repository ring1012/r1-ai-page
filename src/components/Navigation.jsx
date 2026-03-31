import React from 'react'
import { Menu, Home, Database, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: true },
    { name: 'KV Store', icon: Database, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/25">
              R1
            </div>
            <span className="font-bold text-lg tracking-tight">AI Framework</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                item.active 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            Cloudflare Edition
          </div>
        </div>
      </div>
    </nav>
  )
}
