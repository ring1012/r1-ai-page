'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogOut, User, Lock, Settings } from 'lucide-react'

const HeaderContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const ip = searchParams.get('ip')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navigationItems = [
    { href: '/', label: '首页' },
    { href: '/devices', label: '设备管理' },
    { href: '/settings', label: '服务配置' }
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-300">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">管理员</p>
                    <p className="text-xs leading-none text-gray-500">Session Active</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuGroup>
                  <Link href={getFullHref("/settings/security")}>
                    <DropdownMenuItem className="cursor-pointer focus:bg-gray-800 focus:text-white">
                      <Lock className="mr-2 h-4 w-4 text-blue-400" />
                      <span>账户安全</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={getFullHref("/settings")}>
                    <DropdownMenuItem className="cursor-pointer focus:bg-gray-800 focus:text-white">
                      <Settings className="mr-2 h-4 w-4 text-purple-400" />
                      <span>服务配置</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-900/20 focus:text-red-400 text-red-500"
                  onClick={async () => {
                    const { logout } = await import('@/app/actions/auth')
                    await logout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-300">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">管理员</p>
                    <p className="text-xs leading-none text-gray-500">Session Active</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuGroup>
                  <Link href={getFullHref("/settings/security")}>
                    <DropdownMenuItem className="cursor-pointer focus:bg-gray-800 focus:text-white">
                      <Lock className="mr-2 h-4 w-4 text-blue-400" />
                      <span>账户安全</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={getFullHref("/settings")}>
                    <DropdownMenuItem className="cursor-pointer focus:bg-gray-800 focus:text-white">
                      <Settings className="mr-2 h-4 w-4 text-purple-400" />
                      <span>服务配置</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-900/20 focus:text-red-400 text-red-500"
                  onClick={async () => {
                    const { logout } = await import('@/app/actions/auth')
                    await logout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 animate-in slide-in-from-top-4 duration-300">
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
              <div className="pt-4 mt-2 border-t border-gray-800 space-y-2">
                <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Account</p>
                <Link
                  href={getFullHref("/settings/security")}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Lock className="w-4 h-4 text-blue-400" /> 账户安全
                </Link>
                <Link
                  href={getFullHref("/settings")}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 text-purple-400" /> 服务配置
                </Link>
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false)
                    const { logout } = await import('@/app/actions/auth')
                    await logout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/10 rounded-md transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> 退出登录
                </button>
              </div>
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
