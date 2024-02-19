// 'use client'
// import { UserButton } from '@clerk/nextjs'

// import { ModeToggle } from '@/components/mode-toggle'

// export default function Home() {
//   return (
//     <div>
//       <div className="dark:tw-bg-indigo-500 tw-text-indigo-300 dark:tw-text-3xl dark:tw-text-yellow-300">
//         intializing: discord clone practice
//       </div>
//       <UserButton afterSignOutUrl="/" />
//       <ModeToggle />
//     </div>
//   )
// }

import { redirect } from 'next/navigation'

import InitialModal from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'

const SetupPage = async () => {
  const profile = await initialProfile()

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
