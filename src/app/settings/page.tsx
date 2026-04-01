'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PageLayout from '@/components/layout/PageLayout'
import { getGlobalConfig, updateGlobalConfig } from '@/app/actions/iot'
import { GlobalConfig, DEFAULT_GLOBAL_CONFIG } from '@/types/iot'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_GLOBAL_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const val = await getGlobalConfig()
        setConfig(val)
      } catch (e) {
        console.error('Failed to fetch config', e)
        toast.error('获取配置失败')
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateGlobalConfig(config)
      toast.success('配置已保存')
    } catch (e) {
      console.error('Failed to save config', e)
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-400">正在加载...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto py-8">
        <section className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 underline decoration-blue-500 underline-offset-8">服务配置</h1>
            <p className="text-gray-400">设置后台服务器地址及相关服务接口，用于所有设备。</p>
          </div>
          <Link href="/settings/security">
            <Button variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-red-900/10 hover:border-red-500/30 transition-all">
              <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> 安全设置
            </Button>
          </Link>
        </section>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">全局设置</CardTitle>
            <CardDescription className="text-gray-400">
              对应的配置文件为 /etc/r1-iot/global.conf
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hostIp" className="text-gray-200">服务器地址 (hostIp)</Label>
                <Input
                  id="hostIp"
                  value={config.hostIp}
                  onChange={(e) => setConfig({ ...config, hostIp: e.target.value })}
                  placeholder="http://192.168.2.2:18888"
                  className="bg-black border-gray-700 text-white focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">设备主动请求该地址进行通信。</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ytdlpEndpoint" className="text-gray-200">YT-DLP 接入点</Label>
                <Input
                  id="ytdlpEndpoint"
                  value={config.ytdlpEndpoint}
                  onChange={(e) => setConfig({ ...config, ytdlpEndpoint: e.target.value })}
                  placeholder="https://yt.example.com/youtube"
                  className="bg-black border-gray-700 text-white focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">用于视频/音频解析转换的服务地址。</p>
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t border-gray-800">
              <Button 
                type="submit" 
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
              >
                {saving ? '正在保存...' : '保存配置'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  )
}
