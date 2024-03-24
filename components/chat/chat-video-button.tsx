'use client'

import { Video, VideoOff } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

import { ActionTooltip } from '@/components/feature/action-tooltip'

const ChatVideoButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isVideo = searchParams.get('video')

  const Icon = isVideo ? VideoOff : Video
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call'

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    )

    router.push(url)
  }

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:tw-opacity-75 tw-transition tw-mr-4">
        <Icon className="tw-w-6 tw-h-6 tw-text-zinc-500 dark:tw-text-zinc-400" />
      </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
