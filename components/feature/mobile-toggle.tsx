import { Menu } from 'lucide-react'

import NavigationSidebar from '@/components/navigation/navigation-sidebar'
import { ServerSidebar } from '@/components/server'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MobileToggleProps {
  serverId: string
}

const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="tw-mr-2">
        <Button variant="ghost" size="icon" className="md:tw-hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="tw-flex !tw-p-0 !tw-gap-0">
        <div className="tw-w-[72px]">
          <NavigationSidebar />
        </div>

        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
