import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(' tw-animate-pulse tw-rounded-md tw-bg-zinc-300 dark:tw-bg-zinc-900/50', className)}
      {...props}
    />
  )
}

export { Skeleton }
