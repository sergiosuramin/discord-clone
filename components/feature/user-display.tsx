import { RoleIcon } from '@/components/icons'
import { TServerMemberWithProfile } from '@/types/misc'

interface UserDisplayProps {
  member: TServerMemberWithProfile
  avatar?: React.ReactNode
  usernameClassName?: string
  isChat?: boolean
}

// full user / member component with:
// avatar(as props), name and Role tooltip.
// used in server member list and chat sender in chat-item

const UserDisplay = ({ member, avatar, usernameClassName }: UserDisplayProps) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-x-2 tw-cursor-pointer">
      {avatar}
      <p
        className={
          usernameClassName ? usernameClassName : 'tw-font-bold tw-text-sm hover:tw-underline tw-cursor-pointer'
        }
      >
        {member?.profile?.name ?? ''}
      </p>

      <RoleIcon role={member.role} className="tw-flex-shrink-0" />
    </div>
  )
}

export default UserDisplay
