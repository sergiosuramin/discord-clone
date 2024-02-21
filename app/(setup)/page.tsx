import { redirect } from 'next/navigation'

import { InitialModal } from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'

const SetupPage = async () => {
  // get profile after sign in
  const profile = await initialProfile()

  // find the first server where user is a member of
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}

export default SetupPage

// TODO:
// For now, force user to create their server if they dont have one.
// Prior production, it will be changed to:
// owning a server is not required.
// alternative: force user to join creator server by default (last option)
