import { Hash } from 'lucide-react'

import { EChatHeaderType } from '@/types/enums'

interface ChatWelcomeProps {
  type: string
  name: string
}

const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  const isChannel = type === EChatHeaderType.Channel

  return (
    <div className="tw-space-y-2 tw-px-4 tw-mb-4">
      {isChannel && (
        <div className="tw-w-[75px] tw-h-[75px] tw-rounded-full tw-bg-zinc-400/90 dark:tw-bg-zinc-700 tw-flex tw-items-center tw-justify-center">
          <Hash className="tw-w-10 tw-h-10 tw-text-white" />
        </div>
      )}

      <p className="tw-text-xl md:tw-text-3xl tw-font-bold">
        {isChannel ? 'Welcome to #' : ''}
        {name}
      </p>

      <p className="tw-text-zinc-600 dark:tw-text-zinc-400 tw-text-sm">
        {isChannel ? `This is the start of #${name} channel` : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  )
}
export default ChatWelcome
