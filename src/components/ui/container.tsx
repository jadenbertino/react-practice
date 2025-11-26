import type { Wrapper } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function Container({ children, className }: Wrapper) {
  return (
    <div className={cn('mx-auto max-w-7xl sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
