import Header from '@/components/Header'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

const PageLayout = ({ children, className = "min-h-screen bg-black" }: PageLayoutProps) => {
  return (
    <main className={className}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  )
}

export default PageLayout 
