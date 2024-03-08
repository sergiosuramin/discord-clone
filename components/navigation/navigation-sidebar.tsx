import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ModeToggle } from '@/components/feature/mode-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { NavigationAction } from './navigation-action'
import { NavigationItem } from './navigation-item'

const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    // force user to create server if have none
    return redirect('/')
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <div className="tw-space-y-4 tw-flex tw-flex-col tw-items-center tw-w-full tw-h-full tw-text-primary tw-bg-server tw-py-3">
      <NavigationAction />
      <Separator className="!tw-w-8 tw-h-[2px] tw-bg-zinc-300 dark:tw-bg-zinc-700 tw-rounded-md tw-mx-auto" />

      <ScrollArea className="tw-flex-1 tw-w-full">
        {servers.map((server, index) => (
          <div key={server.id ?? index} className="tw-mb-4">
            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
          </div>
        ))}
      </ScrollArea>

      <div className="tw-pb-3 tw-mt-auto tw-flex tw-items-center tw-flex-col tw-gap-y-4">
        <Separator className="!tw-w-8 tw-h-[2px] tw-bg-zinc-300 dark:tw-bg-zinc-700 tw-rounded-md tw-mx-auto" />
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'tw-w-[40px] tw-h-[40px]',
            },
          }}
        />
      </div>
    </div>
  )
}

export default NavigationSidebar
