'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PageLayout from '@/components/layout/PageLayout'
import { updatePassword, logout } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Lock, ShieldAlert, CheckCircle2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function SecurityPage() {
  const [passwords, setPasswords] = useState({ new: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast.error('两次输入的密码不一致')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('新密码长度至少需要 8 位')
      return
    }

    setSaving(true)
    try {
      const result = await updatePassword(passwords.new)
      if (result.success) {
        toast.success('密码修改成功，正在自动登出以重认证...')
        setTimeout(() => logout(), 1500)
      } else {
        toast.error(result.message || '修改失败')
      }
    } catch (e) {
      toast.error('服务器请求超时')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto py-8">
        <Link href="/settings" className="inline-flex items-center text-gray-500 hover:text-white mb-6 text-sm transition-colors group">
          <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 返回服务配置
        </Link>

        <section className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 underline decoration-red-500 underline-offset-8">账户安全</h1>
          <p className="text-gray-400">更新管理员访问密码，确保您的 IoT 生态访问安全。</p>
        </section>

        <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="mr-2 h-5 w-5 text-red-500" /> 修改管理员密码
            </CardTitle>
            <CardDescription className="text-gray-400">
              请牢记新密码。修改成功后您将被登出并需要重新授权登录。
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPass" className="text-gray-200">新密码</Label>
                <div className="relative">
                  <Input
                    id="newPass"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="输入不低于 8 位的密钥"
                    className="bg-black border-gray-700 text-white focus:ring-red-500 font-mono pr-10"
                    required
                  />
                  {passwords.new.length >= 8 && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className={`text-[10px] flex items-center gap-1 ${passwords.new.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                  <ShieldAlert className="h-3 w-3" />
                  强度检测：至少 8 位字符
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPass" className="text-gray-200">确认新密码</Label>
                <Input
                  id="confirmPass"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="请再次填写确认"
                  className="bg-black border-gray-700 text-white focus:ring-red-500 font-mono"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t border-gray-800">
              <Button 
                type="submit" 
                disabled={saving || !passwords.new || passwords.new !== passwords.confirm}
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all"
              >
                {saving ? '正在更新安全密钥...' : '确认修改并强制重登'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  )
}
