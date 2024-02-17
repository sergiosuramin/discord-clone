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

  return <div>Setup Page (Next: Create Server if profile has no server)</div>
}

export default SetupPage
