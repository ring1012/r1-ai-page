import { getCloudflareContext } from "@opennextjs/cloudflare"
import { revalidatePath } from "next/cache"
import PageLayout from "@/components/layout/PageLayout"

export const dynamic = 'force-dynamic'

export default async function KVSamplePage() {
  const { env } = await getCloudflareContext()
  const kvValue = await env.YOU.get("sample-key") || "No value set"

  async function updateKV(formData: FormData) {
    "use server"
    const newValue = formData.get("newValue") as string
    const { env: contextEnv } = await getCloudflareContext()
    await contextEnv.YOU.put("sample-key", newValue)
    revalidatePath("/kv-sample")
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Cloudflare KV 示例</h1>
          <p className="text-gray-400">
            这是一个使用 Server-Side Rendering (SSR) 直接从 Cloudflare KV 读取数据的示例。
          </p>
        </section>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">当前 KV 值 (Key: sample-key)</h2>
            <div className="bg-black border border-gray-800 rounded-lg p-4 font-mono text-blue-400">
              {kvValue}
            </div>
          </div>

          <form action={updateKV} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newValue" className="text-sm font-medium text-gray-300">
                更新值
              </label>
              <input
                type="text"
                id="newValue"
                name="newValue"
                placeholder="输入新的值..."
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              更新 KV
            </button>
          </form>
        </div>

        <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-blue-300 font-bold mb-2">💡 技术细节</h3>
          <ul className="list-disc list-inside text-sm text-blue-200/70 space-y-2">
            <li>使用 <code>getCloudflareContext()</code> 在服务器端访问 KV。</li>
            <li>使用 Next.js <code>Server Actions</code> 处理数据写入。</li>
            <li>使用 <code>revalidatePath</code> 实现即时 UI 更新。</li>
            <li>完全在 Edge 端运行，极低延迟。</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}
