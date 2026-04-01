'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Lock, Smartphone, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await login(password)
      if (result.success) {
        toast.success("登录成功，正在加载引擎...")
        setTimeout(() => {
          router.push('/')
        }, 800)
      } else {
        toast.error(result.message || "密码错误")
      }
    } catch (e) {
      toast.error("网络异常")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <Toaster position="top-center" />
      
      <div className="w-full max-w-md relative z-10 transition-all duration-700 animate-in fade-in zoom-in slide-in-from-bottom-8">
        <div className="text-center mb-10 space-y-4">
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transform rotate-12">
               <Cpu className="w-8 h-8" />
             </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">R1 AI 系统</h1>
          <p className="text-neutral-500 font-medium">访问受限，请输入管理员密码授权。</p>
        </div>

        <Card className="bg-neutral-950/80 border-neutral-800 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden pt-4">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Identity Verification
            </div>
            <CardTitle className="text-white text-2xl font-bold">后台授权</CardTitle>
            <CardDescription className="text-neutral-500">
              请使用您的二级分身身份进行密钥校验。
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-neutral-400 text-xs font-semibold uppercase ml-1">管理员密钥 (Admin Password)</Label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-blue-500 transition-colors">
                     <Lock className="w-4 h-4" />
                   </div>
                   <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入授权访问密码..."
                    className="w-full bg-black/60 border-neutral-800 text-white pl-11 py-6 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-neutral-700 font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-neutral-600 px-1 italic">
                  * 默认密码为 &apos;admin&apos;，如果无法进入请联系架构师。
                </p>
              </div>
            </CardContent>
            <CardFooter className="pb-8 pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,255,255,0.05)] active:scale-95"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    授权登录 <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-8 text-center text-neutral-700 text-sm font-medium">
          &copy; {new Date().getFullYear()} Ring1012 IoT Ecosystem
        </p>
      </div>
    </div>
  )
}
