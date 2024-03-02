import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import { ExplorerIcon, RoleIcon } from '@/components/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { EServerExplorerType } from '@/types/enums'

import { ServerExplorer } from './server-explorer'
import { ServerHeader } from './server-header'

interface ServerSidebarProps {
  serverId: string
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      // this allows users to load the server
      id: serverId,
    },
    // what props to return
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      // let us see who else in the server, and we can see their profile
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc', // alphabetically based on MemberRole enum we defined in prisma schema.
        },
      },
    },
  })

  /**
   * we are going to render all channels here (text, audio, video).
   */

  const textChannels = server?.channels?.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels?.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels?.filter((channel) => channel.type === ChannelType.VIDEO)
  const membersExceptMe = server?.members.filter((member) => member.profileId !== profile.id) // except ourselves

  if (!server) {
    // redirect to /(setup)/page.tsx, where user is being redirected to their own server lists or create new.
    return redirect('/')
  }

  // get our role
  const myRoleInTheServer = server.members.find((member) => member.profileId === profile.id)?.role

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-text-primary tw-bg-channel">
      <ServerHeader server={server} role={myRoleInTheServer} />
      <ScrollArea className="tw-flex-1 tw-px-3">
        <ServerExplorer
          data={[
            {
              label: 'Text Channels',
              type: EServerExplorerType.Channel,
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: <ExplorerIcon channelType={channel.type} className="tw-mr-2" />,
              })),
            },
            {
              label: 'Voice Channels',
              type: EServerExplorerType.Channel,
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: <ExplorerIcon channelType={channel.type} className="tw-mr-2" />,
              })),
            },
            {
              label: 'Video Channels',
              type: EServerExplorerType.Channel,
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: <ExplorerIcon channelType={channel.type} className="tw-mr-2" />,
              })),
            },
            {
              label: 'Members',
              type: EServerExplorerType.Member,
              data: membersExceptMe?.map((member) => ({
                id: member.id,
                name: member?.profile?.name ?? '',
                icon: <RoleIcon role={member.role} className="tw-mr-2" />,
              })),
            },
          ]}
        />
      </ScrollArea>
      channel list is in progress
    </div>
  )
}

export default ServerSidebar
