'use client'
import { Member } from '@prisma/client'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'

import { useChatQuery } from '@/hooks/chat'
import { formatChatTimestamp } from '@/lib/date-formatter'
import { EChatHeaderType, EChatParamKey } from '@/types/enums'
import { TCompleteChannelMessage } from '@/types/misc'

import ChatItem from './chat-item'
import ChatWelcome from './chat-welcome'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: EChatParamKey
  paramValue: string
  type: EChatHeaderType
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: `get-chat:${chatId}`,
    apiUrl,
    paramKey,
    paramValue,
  })

  console.log('lala-- status--', status)

  if (status === 'pending') {
    return (
      // TODO: change to skeleton later
      <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center">
        <Loader2 className="tw-w-7 tw-h-7 tw-text-zinc-700 tw-animate-spin" />
        <p className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400">Loading messages...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center">
        <ServerCrash className="tw-w-7 tw-h-7 tw-text-zinc-700 tw-my-4" />
        <p className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400">
          Something went wrong. Try to reload the page.
        </p>
      </div>
    )
  }

  console.log('lala-- data--', data)

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-py-4 tw-overflow-y-auto">
      <div className="tw-flex-1" />

      <ChatWelcome type={type} name={name} />

      <div className="tw-flex tw-flex-col-reverse tw-mt-auto">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group?.items?.map((message: TCompleteChannelMessage) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={formatChatTimestamp(message.createdAt)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
  // <div key={message.id}>{message.content}</div>
}
export default ChatMessages
