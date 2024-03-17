/**THIS IS SERVER'S CHANNEL TEXT/AUDIO/VIDEO CHAT PAGE */

import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import { ChatHeader, ChatInput, ChatMessages } from '@/components/chat'
import MediaRoom from '@/components/feature/media-room'
import { allMessagesPath, socketMessagePath } from '@/lib/constant'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { EChatHeaderType, EChatParamKey } from '@/types/enums'

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

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl={allMessagesPath} // get the messages
            socketUrl={socketMessagePath} // POST to send new message
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey={EChatParamKey.ChannelId}
            paramValue={channel.id}
            type={EChatHeaderType.Channel}
          />

          <ChatInput
            name={channel.name}
            type={EChatHeaderType.Channel}
            apiUrl={socketMessagePath}
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && <MediaRoom chatId={channel.id} audio video={false} />}

      {channel.type === ChannelType.VIDEO && <MediaRoom chatId={channel.id} audio video />}
    </div>
  )
}

export default ChannelIdPage
