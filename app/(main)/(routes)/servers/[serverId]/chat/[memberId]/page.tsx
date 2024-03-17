/**THIS IS DIRECT MESSAGE PAGE */

import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ChatHeader, ChatInput, ChatMessages } from '@/components/chat'
import MediaRoom from '@/components/feature/media-room'
import { allDirectMessagePath, socketDirectMessagePath } from '@/lib/constant'
import { generateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { EChatHeaderType, EChatParamKey } from '@/types/enums'

interface ChatPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const ChatWithMemberPage = async ({ params, searchParams }: ChatPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const myself = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!myself) {
    redirect('/')
  }

  /**
   * when we click a member from the server, their ID was exposed in the URL.
   * so, make that as the 2nd parameter.
   */
  const dmConversation = await generateConversation(myself.id, params.memberId)

  /**
   * in case shit happens, go back to "general" chat room in the server
   */
  if (!dmConversation) {
    redirect(`/servers/${params.serverId}`)
  }

  // conversation exists (created or get)
  const { memberOne, memberTwo } = dmConversation

  /** if member-1 is ourselves, then our interlocutors is the member-2. Vice versa.
   * we check this because we don't know who initiated the conversation of the DM.
   * so, other member will always be the member whose ID is in the URL
   */
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="tw-bg-chatHeader tw-flex tw-flex-col tw-h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type={EChatHeaderType.DirectMessage}
      />

      {searchParams.video ? (
        <>
          <MediaRoom chatId={dmConversation.id} audio video />
        </>
      ) : (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            member={myself}
            chatId={dmConversation.id}
            apiUrl={allDirectMessagePath} // get the messages
            socketUrl={socketDirectMessagePath} // POST to send new message
            socketQuery={{
              conversationId: dmConversation.id,
            }}
            paramKey={EChatParamKey.ConversationId}
            paramValue={dmConversation.id}
            type={EChatHeaderType.DirectMessage}
          />

          <ChatInput
            name={otherMember.profile.name}
            type={EChatHeaderType.DirectMessage}
            apiUrl={socketDirectMessagePath}
            query={{
              conversationId: dmConversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default ChatWithMemberPage
