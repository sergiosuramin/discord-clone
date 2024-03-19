import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/function'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string
  className?: string
  fallback?: string
  onClick?: () => void
}

const UserAvatar = ({ src, fallback, className, onClick }: UserAvatarProps) => {
  return (
    <Avatar
      className={cn('md:tw-w-12 md:tw-h-12', !!onClick && 'tw-cursor-pointer', className)}
      onClick={() => onClick?.()}
    >
      <AvatarImage src={src} />
      <AvatarFallback className="tw-text-xs md:tw-text-lg tw-text-violet-600 dark:tw-text-violet-400 tw-uppercase">
        {getInitials(fallback)}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
