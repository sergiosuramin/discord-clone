'use client'

import { MemberRole } from '@prisma/client'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { Fragment, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useCurrentRole } from '@/hooks/misc'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { cn } from '@/lib/utils'
import { EModalType } from '@/types/enums'
import { TServerAllProps } from '@/types/misc'

interface ServerHeaderProps {
  server: TServerAllProps
  role?: MemberRole
}

interface ServerMenuItemProps {
  title: string
  className?: string
  onClick?: () => void
  icon: ReactNode
}

const ServerMenuItem = ({ title, className, onClick, icon }: ServerMenuItemProps) => {
  return (
    <DropdownMenuItem
      className={cn(
        'tw-px-3 tw-py-2 tw-text-sm tw-cursor-pointer hover:!tw-bg-indigo-600/70 dark:hover:tw-bg-indigo-400 hover:tw-text-primary dark:hover:tw-text-primary',
        className
      )}
      onClick={() => onClick?.()}
    >
      {title}
      {icon}
    </DropdownMenuItem>
  )
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal()
  const { isAdmin, isModerator } = useCurrentRole(role)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:tw-outline-none" asChild>
        <Button
          variant="transparent"
          className="tw-w-full tw-h-12 tw-items-center tw-text-md tw-font-semibold tw-px-3 tw-border-b-2 tw-rounded-none hover:tw-bg-zinc-700/10 dark:tw-border-neutral-800 dark:hover:tw-bg-zinc-700/50 tw-transition"
        >
          {server.name}
          <ChevronDown className="tw-w-5 tw-h-5 tw-ml-auto" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="tw-w-56 tw-text-xs tw-font-medium tw-text-black dark:tw-text-neutral-400 tw-space-y-0.5">
        {(isAdmin || isModerator) && (
          <ServerMenuItem
            title="Invite People"
            onClick={() => onOpen(EModalType.InviteToServer, { server })}
            className="tw-text-indigo-600 dark:tw-text-indigo-400"
            icon={<UserPlus className="tw-w-4 tw-h-4 tw-ml-auto" />}
          />
        )}

        {isAdmin && (
          <Fragment>
            <ServerMenuItem
              title="Server Settings"
              onClick={() => onOpen(EModalType.ServerSetting, { server })}
              icon={<Settings className="tw-w-4 tw-h-4 tw-ml-auto" />}
            />
            <ServerMenuItem
              title="Manage Members"
              onClick={() => alert('manage member')}
              icon={<Users className="tw-w-4 tw-h-4 tw-ml-auto" />}
            />
          </Fragment>
        )}

        {(isAdmin || isModerator) && (
          <ServerMenuItem
            title="Create Channel"
            onClick={() => alert('create channel')}
            icon={<PlusCircle className="tw-w-4 tw-h-4 tw-ml-auto" />}
          />
        )}

        {(isAdmin || isModerator) && <DropdownMenuSeparator />}

        {isAdmin && (
          <ServerMenuItem
            title="Delete Server"
            className="tw-text-rose-500 hover:!tw-bg-rose-600/70 dark:hover:!tw-bg-rose-500"
            onClick={() => alert('delete server')}
            icon={<Trash className="tw-w-4 tw-h-4 tw-ml-auto" />}
          />
        )}

        {!isAdmin && (
          <ServerMenuItem
            title="Leave Server"
            className="tw-text-rose-500 hover:!tw-bg-rose-600/70 dark:hover:!tw-bg-rose-500"
            onClick={() => alert('leave server')}
            icon={<LogOut className="tw-w-4 tw-h-4 tw-ml-auto" />}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
