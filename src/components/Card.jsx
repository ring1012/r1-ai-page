import { cn } from "@/lib/utils"

export function Card({ className, children }) {
  return (
    <div className={cn("rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 shadow-2xl", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ className, title, description }) {
  return (
    <div className={cn("space-y-1.5 mb-6", className)}>
      <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  )
}
