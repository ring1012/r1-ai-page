"use client";

import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { BookOpen, Settings, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const ipParam = searchParams.get("ip");

  const getFullHref = (href: string) => {
    if (!ipParam) return href;
    return `${href}?ip=${ipParam}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 px-4 pt-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          欢迎来到 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">R1 AI 系统</span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          一个专为 R1 音箱生态构建的高性能云端管理平台。
        </p>
      </section>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KV Sample Card */}
        <Link href={getFullHref("/kv-sample")} className="group">
          <div className="h-full bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 hover:bg-neutral-800/40 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform opacity-20 group-hover:opacity-40">
              <Cpu className="w-24 h-24 text-blue-400" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">KV 管理示例</h2>
              <p className="text-neutral-400 leading-relaxed text-sm">
                体验 Cloudflare KV 存储的极速读写。在 Edge 端直接处理状态，摒弃传统数据库的繁重。
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold group-hover:gap-3 transition-all relative z-10">
              立即体验 SSR 存储 <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Placeholder / Future Feature Card */}
        <div className="group">
          <div className="h-full bg-neutral-900/10 border border-neutral-800 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col justify-center items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-500">更多功能开发中</h2>
              <p className="text-neutral-600 text-sm mt-2 max-w-xs">
                AI 服务集成、固件更新及语音指令集管理即将上线。
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-10 text-center border-t border-neutral-800/50">
        <div className="text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} ring1012. Built with Next.js & Cloudflare.
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4 text-neutral-400">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="font-medium tracking-wide">初始化引擎...</p>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </PageLayout>
  );
}
