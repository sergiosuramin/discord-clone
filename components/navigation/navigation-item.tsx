'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ActionTooltip } from '@/components/action-tooltip'
import { useCurrentServer } from '@/hooks/misc'
import { cn } from '@/lib/utils'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}
export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const router = useRouter()
  const { isCurrentServer } = useCurrentServer(id)

  const onServerClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <div>
      <ActionTooltip label={name} side="right" align="center">
        <button className="tw-group tw-relative tw-flex tw-items-center" onClick={() => onServerClick()}>
          {/* selected server indicator */}
          <div
            className={cn(
              'tw-absolute tw-left-0 tw-bg-primary tw-rounded-r-full tw-transition-all tw-w-[4px]',
              isCurrentServer ? 'tw-h-[36px]' : 'tw-h-[8px] group-hover:tw-h-[20px]'
            )}
          />

          {/* server image */}

          <div
            className={cn(
              'tw-relative tw-group tw-flex tw-mx-4 tw-w-[40px] tw-h-[40px] tw-rounded-[20px] group-hover:tw-rounded-[12px] tw-transition-all tw-overflow-hidden',
              isCurrentServer && 'group-hover:tw-bg-primary/10 tw-text-primary !tw-rounded-[12px]'
            )}
          >
            <Image fill src={imageUrl} alt="server-channels" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
