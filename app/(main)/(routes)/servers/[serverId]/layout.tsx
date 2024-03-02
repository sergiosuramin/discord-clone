import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ServerSidebar } from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

interface ServerIdLayoutProps {
  children: React.ReactNode
  params: { serverId: string }
}

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      // this allows users to load the server
      id: params.serverId,
      // only member of the server are able to see. Done by matching the profileId.
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) {
    // redirect to /(setup)/page.tsx, where user is being redirected to their own server lists or create new.
    return redirect('/')
  }

  return (
    <div className="tw-h-svh">
      {/* channel and member list */}
      <div className="tw-hidden md:tw-flex tw-flex-col tw-h-full tw-w-60 tw-z-20 tw-fixed tw-inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>

      <main className="md:tw-pl-60 tw-h-full">{children}</main>
    </div>
  )
}

export default ServerIdLayout
