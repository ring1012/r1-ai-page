'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const HeaderContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const ip = searchParams.get('ip')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navigationItems = [
    { href: '/', label: '首页' },
    { href: '/kv-sample', label: 'KV 示例' },
  ]

  const getFullHref = (href: string) => {
    if (!ip) return href
    return `${href}?ip=${ip}`
  }

  return (
    <header className="w-full bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between relative">
          <Link href={getFullHref('/')}>
            <div className="flex items-center space-x-3 group">
              <h1 className="text-lg font-semibold group-hover:text-blue-400 transition-colors text-white">R1 AI 管理</h1>
            </div>
          </Link>

          {/* Navigation - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={getFullHref(item.href)} className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      "text-gray-300"
                    )}>
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4">
             {/* Action items if any */}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between">
          <Link href={getFullHref('/')}>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold text-white">R1 AI</h1>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={getFullHref(item.href)}
                  className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

const Header = () => {
  return (
    <Suspense fallback={<header className="w-full h-[73px] bg-gray-900/50 border-b border-gray-800" />}>
      <HeaderContent />
    </Suspense>
  )
}

export default Header
