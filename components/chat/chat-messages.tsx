'use client'
import { Member } from '@prisma/client'
import { Loader2, ServerCrash } from 'lucide-react'
import { ElementRef, Fragment, useRef } from 'react'

import { useChatQuery, useChatScroll, useChatSocket } from '@/hooks/chat'
import { formatChatTimestamp } from '@/lib/date-formatter'
import { EChatHeaderType, EChatParamKey } from '@/types/enums'
import { TCompleteChannelMessage } from '@/types/misc'
import { TChatResponse } from '@/types/response'

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
  const rq = {
    addKey: `chat:${chatId}:messages`, // the key must match with the one we defined in the /pages/api/socket
    updateKey: `chat:${chatId}:messages:update`, // the key must match with the one we defined in the /pages/api/socket
    queryKey: `chat:${chatId}`,
  }

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: rq.queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  // real-time message listener
  useChatSocket({
    addKey: rq.addKey,
    updateKey: rq.updateKey,
    queryKey: rq.queryKey,
  })

  // infinite scroll event and new message listener
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages[0]?.items.length ?? 0,
  })

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

  return (
    <div ref={chatRef} className="tw-flex-1 tw-flex tw-flex-col tw-py-4 tw-overflow-y-auto">
      {/* !hasNextPage indicates we are in the last page, when there's nothing to load */}
      {!hasNextPage && <div className="tw-flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className="tw-flex tw-justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="tw-w-7 tw-h-7 tw-text-zinc-700 tw-animate-spin" />
          ) : (
            <button
              className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition tw-my-4"
              onClick={() => fetchNextPage()} // can be used as a fallback if the scroll didnt run
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="tw-flex tw-flex-col-reverse tw-mt-auto">
        {(data as TChatResponse)?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group?.items.map((message: TCompleteChannelMessage) => (
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

      <div ref={bottomRef} />
    </div>
  )
}
export default ChatMessages
