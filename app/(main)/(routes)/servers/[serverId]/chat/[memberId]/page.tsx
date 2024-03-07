/**THIS IS DIRECT MESSAGE PAGE */

import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat'
import { generateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { EChatHeaderType } from '@/types/enums'

interface ChatPageProps {
  params: {
    memberId: string
    serverId: string
  }
}

const ChatWithMemberPage = async ({ params }: ChatPageProps) => {
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

  /** if member-1 is ourselves, than our interlocutors is the member-2, and vice versa.
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
    </div>
  )
}

export default ChatWithMemberPage
