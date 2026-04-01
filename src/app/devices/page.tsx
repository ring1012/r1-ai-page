'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageLayout from '@/components/layout/PageLayout'
import { getDevices, saveDevice, deleteDevice, getCurrentDeviceId, setCurrentDeviceId } from '@/app/actions/iot'
import { DeviceConfig, DEFAULT_DEVICE_CONFIG } from '@/types/iot'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Plus, Trash2, Edit2, CheckCircle, Smartphone, Clock, Save, X } from 'lucide-react'

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDevice, setEditingDevice] = useState<DeviceConfig | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDeviceId, setLocalCurrentDeviceId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const allDevices = await getDevices()
      const currentId = await getCurrentDeviceId()
      setDevices(allDevices)
      setLocalCurrentDeviceId(currentId)

      // If currentDeviceId is set, prepopulate editing
      if (currentId) {
        const current = allDevices.find(d => d.id === currentId)
        if (current) {
          setEditingDevice(current)
          setIsDialogOpen(true)
        }
      }
    } catch (e) {
      console.error('Failed to fetch data', e)
      toast.error('获取设备列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = () => {
    setEditingDevice(DEFAULT_DEVICE_CONFIG(''))
    setIsDialogOpen(true)
  }

  const handleEdit = (device: DeviceConfig) => {
    setEditingDevice({ ...device })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个设备吗？')) return
    try {
      await deleteDevice(id)
      toast.success('设备已删除')
      fetchData()
    } catch (e) {
      toast.error('删除失败')
    }
  }

  const handleSetCurrent = async (id: string) => {
    try {
      await setCurrentDeviceId(id === currentDeviceId ? null : id)
      setLocalCurrentDeviceId(id === currentDeviceId ? null : id)
      toast.success(id === currentDeviceId ? '已取消当前设备' : '已设置为当前预览设备')
    } catch (e) {
      toast.error('操作失败')
    }
  }

  const handleSave = async () => {
    if (!editingDevice || !editingDevice.id) {
      toast.error('设备 ID 不能为空')
      return
    }
    setIsSaving(true)
    try {
      await saveDevice(editingDevice)
      toast.success('设备已保存')
      setIsDialogOpen(false)
      fetchData()
    } catch (e) {
      toast.error('提交失败')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading && devices.length === 0) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-400">正在扫描设备...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto py-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 underline decoration-green-500 underline-offset-8">设备管理</h1>
            <p className="text-gray-400">管理您的 R1 智能助手设备配置与状态。</p>
          </div>
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]">
            <Plus className="mr-2 h-4 w-4" /> 添加新设备
          </Button>
        </header>

        <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800/50">
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">设备名称</TableHead>
                <TableHead className="text-gray-300">设备 ID</TableHead>
                <TableHead className="text-gray-300 hidden md:table-cell">创建时间</TableHead>
                <TableHead className="text-gray-300 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-500 font-medium">暂无设备，点击上方按钮添加。</TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow key={device.id} className={device.id === currentDeviceId ? 'bg-blue-900/10 border-blue-900/20' : 'border-gray-800 hover:bg-gray-800/30'}>
                    <TableCell className="font-semibold text-white">
                      <div className="flex items-center">
                        <Smartphone className="inline-block mr-2 h-4 w-4 text-blue-400" />
                        {device.name || '未命名设备'}
                        {device.id === currentDeviceId && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-bold animate-pulse">当前</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 font-mono text-xs">{device.id}</TableCell>
                    <TableCell className="text-gray-500 text-xs hidden md:table-cell">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {device.createdAt ? new Date(device.createdAt).toLocaleDateString() : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSetCurrent(device.id)}
                          className={device.id === currentDeviceId ? 'text-blue-400' : 'text-gray-500 hover:text-blue-400'}
                          title="设为当前设备"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(device)}
                          className="text-gray-500 hover:text-green-400"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(device.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Edit2 className="mr-2 h-6 w-6 text-blue-400" />
                {editingDevice?.createdAt ? '编辑设备' : '添加新设备'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                配置设备的 AI、智联及多媒体服务参数。
              </DialogDescription>
            </DialogHeader>

            {editingDevice && (
              <div className="py-4">
                <Tabs defaultValue="base" className="w-full">
                  <TabsList className="grid grid-cols-4 bg-gray-800 border-gray-700">
                    <TabsTrigger value="base">基本</TabsTrigger>
                    <TabsTrigger value="ai">AI</TabsTrigger>
                    <TabsTrigger value="hass">智联</TabsTrigger>
                    <TabsTrigger value="other">服务</TabsTrigger>
                  </TabsList>

                  <TabsContent value="base" className="space-y-4 p-4 bg-gray-800/30 rounded-lg mt-4 border border-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="id" className="text-gray-300">设备 ID</Label>
                        <Input 
                          id="id" 
                          value={editingDevice.id}
                          disabled={!!editingDevice.createdAt}
                          onChange={(e) => setEditingDevice({...editingDevice, id: e.target.value.toUpperCase()})}
                          placeholder="如: CBCAU1033K00457"
                          className="bg-black border-gray-700 focus:ring-blue-500 font-mono disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">设备名称</Label>
                        <Input 
                          id="name" 
                          value={editingDevice.name}
                          onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                          placeholder="如: 上海客厅"
                          className="bg-black border-gray-700 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4 p-4 bg-gray-800/30 rounded-lg mt-4 border border-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">AI 平台</Label>
                        <Input value={editingDevice.aiConfig.choice} disabled className="bg-black/50 border-gray-700 opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model" className="text-gray-300">模型型号</Label>
                        <Input 
                          id="model" 
                          value={editingDevice.aiConfig.model}
                          onChange={(e) => setEditingDevice({...editingDevice, aiConfig: {...editingDevice.aiConfig, model: e.target.value}})}
                          className="bg-black border-gray-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="text-gray-300">API Key</Label>
                      <Input 
                        id="apiKey" 
                        type="password"
                        value={editingDevice.aiConfig.key}
                        onChange={(e) => setEditingDevice({...editingDevice, aiConfig: {...editingDevice.aiConfig, key: e.target.value}})}
                        className="bg-black border-gray-700 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endpoint" className="text-gray-300">API 接口地址</Label>
                      <Input 
                        id="endpoint" 
                        value={editingDevice.aiConfig.endpoint}
                        onChange={(e) => setEditingDevice({...editingDevice, aiConfig: {...editingDevice.aiConfig, endpoint: e.target.value}})}
                        className="bg-black border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="systemPrompt" className="text-gray-300">系统提示词 (System Prompt)</Label>
                      <Input 
                        id="systemPrompt" 
                        value={editingDevice.aiConfig.systemPrompt}
                        onChange={(e) => setEditingDevice({...editingDevice, aiConfig: {...editingDevice.aiConfig, systemPrompt: e.target.value}})}
                        className="bg-black border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraBody" className="text-gray-300">附加请求体 (JSON)</Label>
                      <Input 
                        id="extraBody" 
                        value={editingDevice.aiConfig.extraBody}
                        onChange={(e) => setEditingDevice({...editingDevice, aiConfig: {...editingDevice.aiConfig, extraBody: e.target.value}})}
                        className="bg-black border-gray-700 font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="hass" className="space-y-4 p-4 bg-gray-800/30 rounded-lg mt-4 border border-gray-800">
                    <div className="space-y-2">
                      <Label htmlFor="hEndpoint" className="text-gray-300">Hass Endpoint</Label>
                      <Input 
                        id="hEndpoint" 
                        value={editingDevice.hassConfig.endpoint || ''}
                        onChange={(e) => setEditingDevice({...editingDevice, hassConfig: {...editingDevice.hassConfig, endpoint: e.target.value}})}
                        placeholder="如: http://192.168.1.100:8123"
                        className="bg-black border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hToken" className="text-gray-300">Long-Lived Access Token</Label>
                      <Input 
                        id="hToken" 
                        type="password"
                        value={editingDevice.hassConfig.token || ''}
                        onChange={(e) => setEditingDevice({...editingDevice, hassConfig: {...editingDevice.hassConfig, token: e.target.value}})}
                        className="bg-black border-gray-700 font-mono"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="other" className="space-y-4 p-4 bg-gray-800/30 rounded-lg mt-4 border border-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">新闻服务</Label>
                        <Input value={editingDevice.newsConfig.choice} disabled className="bg-black/50 border-gray-700 opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">音乐服务</Label>
                        <Input value={editingDevice.musicConfig.choice} disabled className="bg-black/50 border-gray-700 opacity-50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mEndpoint" className="text-gray-300">音乐服务地址 (Endpoint)</Label>
                      <Input 
                        id="mEndpoint" 
                        value={editingDevice.musicConfig.endpoint || ''}
                        onChange={(e) => setEditingDevice({...editingDevice, musicConfig: {...editingDevice.musicConfig, endpoint: e.target.value}})}
                        placeholder="如: http://music-api.local"
                        className="bg-black border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationId" className="text-gray-300">位置编码 (locationId)</Label>
                      <Input 
                        id="locationId" 
                        value={editingDevice.musicConfig.locationId}
                        onChange={(e) => setEditingDevice({...editingDevice, musicConfig: {...editingDevice.musicConfig, locationId: e.target.value}})}
                        placeholder="请输入城市编码..."
                        className="bg-black border-gray-700"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <DialogFooter className="mt-8 gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-white">
                <X className="mr-2 h-4 w-4" /> 取消
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto px-10"
              >
                {isSaving ? '正在保存...' : (
                  <div className="flex items-center">
                    <Save className="mr-2 h-4 w-4" /> 提交
                  </div>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  )
}
