import { RoleIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { TServerMemberWithProfile } from '@/types/misc'

interface UserDisplayProps {
  member: TServerMemberWithProfile
  avatar?: React.ReactNode
  usernameClassName?: string
  isChat?: boolean
  onClick?: () => void
  isOurselves?: boolean
}

// full user / member component with:
// avatar(as props), name and Role tooltip.
// used in server member list and chat sender in chat-item

const UserDisplay = ({
  member,
  avatar,
  usernameClassName,
  onClick,
  isChat = false,
  isOurselves = false,
}: UserDisplayProps) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-x-2">
      {avatar}
      <p
        className={cn(
          usernameClassName ? usernameClassName : 'tw-font-bold tw-text-sm',
          !isOurselves && 'tw-cursor-pointer',
          !isOurselves && isChat && 'hover:tw-underline'
        )}
        onClick={() => onClick?.()}
      >
        {member?.profile?.name ?? ''}
      </p>

      <RoleIcon role={member.role} className="tw-flex-shrink-0" />
    </div>
  )
}

export default UserDisplay
