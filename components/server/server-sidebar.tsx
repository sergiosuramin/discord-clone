import { redirectToSignIn } from '@clerk/nextjs'
// import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

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

  // const textChannels = server?.channels?.filter((channel) => channel.type === ChannelType.TEXT)
  // const audioChannels = server?.channels?.filter((channel) => channel.type === ChannelType.AUDIO)
  // const videoChannels = server?.channels?.filter((channel) => channel.type === ChannelType.VIDEO)
  // const membersExceptMe = server?.members.filter((member) => member.profileId !== profile.id) // except ourselves

  if (!server) {
    // redirect to /(setup)/page.tsx, where user is being redirected to their own server lists or create new.
    return redirect('/')
  }

  // get our role
  const myRoleInTheServer = server.members.find((member) => member.profileId === profile.id)?.role

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-text-primary tw-bg-channel">
      <ServerHeader server={server} role={myRoleInTheServer} />
      channel list is in progress
    </div>
  )
}
