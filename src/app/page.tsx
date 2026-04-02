"use client";

import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { BookOpen, Settings, ArrowRight, ShieldCheck, Cpu, Smartphone } from 'lucide-react';
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
        {/* Device Management Card */}
        <Link href={getFullHref("/devices")} className="group">
          <div className="h-full bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 hover:bg-neutral-800/40 hover:border-green-500/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_0_50px_rgba(34,197,94,0.15)]">
            <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform opacity-20 group-hover:opacity-40">
              <Smartphone className="w-24 h-24 text-green-400" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors">设备管理</h2>
              <p className="text-neutral-400 leading-relaxed text-sm">
                管理 R1 智能音箱的 AI 引擎、智联配置及多媒体服务。支持批量配置与状态同步。
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-green-400 font-bold group-hover:gap-3 transition-all relative z-10">
              管理 IoT 设备 <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>



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
