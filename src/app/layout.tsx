import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R1 AI - 云端管理平台",
  description: "基于 Next.js 和 Cloudflare Pages 构建的高性能管理平台，支持 SSR 访存及 Edge 计算。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN" className="dark">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
					<NextTopLoader
						color="#3b82f6"
						initialPosition={0.08}
						crawlSpeed={200}
						height={3}
						crawl={true}
						showSpinner={false}
						easing="ease"
						speed={200}
						shadow="0 0 10px #3b82f6, 0 0 5px #3b82f6"
						zIndex={9999}
					/>
					{children}
			</body>
		</html>
	);
}
