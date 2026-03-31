import React, { useState, useEffect } from 'react'
import Layout from './components/Layout'
import { Card, CardHeader } from './components/Card'
import { Activity, Zap, Shield, Server } from 'lucide-react'

export default function App() {
  const [stats, setStats] = useState({ views: 0, lastUpdated: 'Loading...' });
  const [loading, setLoading] = useState(false);

  async function fetchStats() {
    const res = await fetch('/api/kv');
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  }

  async function incrementStats() {
    setLoading(true);
    const res = await fetch('/api/kv', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
    // In actual SSR, the 'functions/api/kv.js' would handle this path.
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary transform transition-transform hover:scale-110">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">System Speed</p>
              <h3 className="text-3xl font-bold tracking-tight">98.2<span className="text-sm text-gray-400 font-normal ml-1">ms</span></h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-cyan-400">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Live Views</p>
              <h3 className="text-3xl font-bold tracking-tight">{stats.views}</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-400">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-400/10 rounded-xl text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Security</p>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-400">100%</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-400">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-400/10 rounded-xl text-amber-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Uptime</p>
              <h3 className="text-3xl font-bold tracking-tight">99.99</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader 
              title="Cloudflare SSR + KV Storage Demo" 
              description="Real-time persistent state management on the Edge Network."
            />
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Live KV State</h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Last KV Update: {new Date(stats.lastUpdated).toLocaleTimeString()}
                      </div>
                    </div>
                    <button 
                      onClick={incrementStats}
                      disabled={loading}
                      className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-semibold text-sm transition-all shadow-lg shadow-primary/30 active:scale-95"
                    >
                      {loading ? 'Processing...' : 'Update KV Counter'}
                    </button>
                  </div>
                  
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-primary h-full transition-all duration-1000 animate-loading-bar" style={{ width: '100%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    <span>Edge Node sync</span>
                    <span>Global Replicated</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-primary font-bold text-xs block mb-1">Server Interaction</span>
                  <p className="text-xs text-gray-400">Routes handled by <code>functions/api/kv.js</code> via SSR hooks.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-primary font-bold text-xs block mb-1">State persistence</span>
                  <p className="text-xs text-gray-400">Data persists across sessions globally via Cloudflare KV.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Environment" description="Runtime configuration" />
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-gray-500 text-xs">Framework</span>
                <span className="font-mono text-xs">R1 Core</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-gray-500 text-xs">Platform</span>
                <span className="font-mono text-xs">Cloudflare Pages</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-gray-500 text-xs">Region</span>
                <span className="font-mono text-xs">Global Edge</span>
              </div>
               <div className="flex items-center justify-between text-sm py-2">
                <span className="text-gray-500 text-xs">Auth</span>
                <span className="font-mono text-xs bg-amber-500/10 text-amber-500 px-1 rounded">PENDING</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
