import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { EChatHeaderType } from '@/types/enums'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  // fetch channel by id
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  })

  // get the specified member that is inside the server's channel
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) {
    // indicating they dont have access, we redirect them to root.
    redirect('/')
  }

  return (
    <div className="tw-bg-chatHeader tw-flex tw-flex-col tw-h-full">
      <ChatHeader name={channel.name} serverId={params.serverId} type={EChatHeaderType.Channel} />
    </div>
  )
}

export default ChannelIdPage
