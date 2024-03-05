import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import { ChannelIcon, RoleIcon } from '@/components/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { EServerExplorerType } from '@/types/enums'

import ServerChannel from './server-channel'
import { ServerExplorer } from './server-explorer'
import { ServerHeader } from './server-header'
import ServerMember from './server-member'
import ServerSection from './server-section'

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
      <ScrollArea className="tw-flex-1 tw-px-3 tw-py-2">
        <ServerExplorer
          data={[
            {
              label: 'Text Channels',
              type: EServerExplorerType.Channel,
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: <ChannelIcon channelType={channel.type} className="tw-mr-2" />,
              })),
            },
            {
              label: 'Voice Channels',
              type: EServerExplorerType.Channel,
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: <ChannelIcon channelType={channel.type} className="tw-mr-2" />,
              })),
            },
            {
              label: 'Video Channels',
              type: EServerExplorerType.Channel,
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: <ChannelIcon channelType={channel.type} className="tw-mr-2" />,
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

        <Separator className="tw-bg-zinc-200 dark:tw-bg-zinc-700 tw-rounded-md tw-my-2" />

        {!!textChannels?.length && (
          <div className="tw-mb-2">
            <ServerSection
              label="Text Channels"
              sectionType={EServerExplorerType.Channel}
              channelType={ChannelType.TEXT}
              role={myRoleInTheServer}
            />

            <div className="tw-space-y-1">
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={myRoleInTheServer} />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="tw-mb-2">
            <ServerSection
              label="Voice Channels"
              sectionType={EServerExplorerType.Channel}
              channelType={ChannelType.AUDIO}
              role={myRoleInTheServer}
            />

            <div className="tw-space-y-1">
              {audioChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={myRoleInTheServer} />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="tw-mb-2">
            <ServerSection
              label="Video Channels"
              sectionType={EServerExplorerType.Channel}
              channelType={ChannelType.VIDEO}
              role={myRoleInTheServer}
            />

            <div className="tw-space-y-1">
              {videoChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={myRoleInTheServer} />
              ))}
            </div>
          </div>
        )}

        {!!membersExceptMe?.length && (
          <div className="tw-mb-2">
            <ServerSection
              label="Members"
              sectionType={EServerExplorerType.Member}
              role={myRoleInTheServer}
              server={server}
            />

            {membersExceptMe.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
