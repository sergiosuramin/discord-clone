import { redirect } from 'next/navigation'

import { InitialModal } from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'

const SetupPage = async () => {
  // get profile after sign in
  const profile = await initialProfile()

  // find the first server where user is a member of
  const firstServer = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  // user have at least 1 server
  if (firstServer) {
    return redirect(`/servers/${firstServer.id}`)
  }

  // let's say user have no server at all.
  // we will offer user to either create or join creator's root server

  // hardcode checking
  const creatorServer = await db.server.findUnique({
    where: {
      id: '827cd88f-83ad-4670-8318-d4fd6976732c',
    },
  })

  return <InitialModal creatorServerInviteCode={creatorServer.inviteCode} />
}

export default SetupPage
