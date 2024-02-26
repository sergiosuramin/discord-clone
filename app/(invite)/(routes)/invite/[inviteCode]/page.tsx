/**
 * This page's dynamic route should match the invite code URL we defined
 * Definition can be found in 'inviteUrl' in /modals/invite-modal.tsx
 */

import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

interface InviteCodePageProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  // invite code not exists
  if (!params.inviteCode) {
    return redirect('/')
  }

  // user already join
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  // direct to the existing server if user has joined before
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }

  // otherwise, new user is joining the server
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
            // dont need to define the role, we already set GUEST as default.
            // check "role MemberRole @default(GUEST)" in schema.prisma
          },
        ],
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  // server doesn't exists
  return null
}

export default InviteCodePage
