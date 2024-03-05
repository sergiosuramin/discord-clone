'use client'
import { useParams } from 'next/navigation'

import { RoleIcon } from '@/components/icons'
import UserAvatar from '@/components/user-avatar'
import { getInitials } from '@/lib/function'
import { cn } from '@/lib/utils'
import { TServerMemberProps } from '@/types/misc'

const ServerMember = ({ member, server }: TServerMemberProps) => {
  console.log('lala-- server--', server)
  const params = useParams()

  const isCurrentMember = params?.memberId === member.id

  return (
    <button
      className={cn(
        'tw-group tw-p-2 tw-rounded-md tw-flex tw-items-center tw-w-full hover:tw-bg-zinc-700/20 dark:hover:tw-bg-zinc-700/70 tw-transition tw-mb-1 tw-gap-x-2',
        isCurrentMember && 'tw-bg-zinc-700/20 dark:tw-bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        fallback={getInitials(member?.profile?.name)}
        className="tw-w-8 tw-h-8 md:tw-w-8 md:tw-h-8"
      />

      <p
        className={cn(
          'tw-line-clamp-1 tw-text-left tw-font-semibold tw-text-sm tw-text-zinc-500 dark:tw-text-zinc-400 group-hover:tw-text-zinc-600 dark:group-hover:tw-text-zinc-300 tw-transition',
          isCurrentMember && 'tw-text-primary dark:tw-text-zinc-200 dark:group-hover:tw-text-white'
        )}
      >
        {member?.profile?.name ?? ''}
      </p>

      <RoleIcon role={member.role} className="tw-flex-shrink-0" />
    </button>
  )
}

export default ServerMember
