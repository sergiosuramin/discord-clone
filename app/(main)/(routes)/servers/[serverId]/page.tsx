import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ELockedChannelName } from '@/types/enums'

interface ServerPageProps {
  params: { serverId: string }
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id, // confirming we are a member of the server
        },
      },
    },
    include: {
      channels: {
        where: {
          name: ELockedChannelName.general, // reuse this enum
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0] // all server should have 1 channel, which is general

  // technically this won't happen, but add an additional layer never hurts.
  if (initialChannel?.name !== ELockedChannelName.general) return null

  // redirect to "general"
  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`)
}

export default ServerPage
