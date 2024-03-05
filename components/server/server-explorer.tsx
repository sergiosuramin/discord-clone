'use client'

import { Search } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { EServerExplorerType } from '@/types/enums'
import { IServerExplorerProps } from '@/types/misc'

interface CommandItemEventProps {
  id: string
  type: EServerExplorerType
}

export const ServerExplorer = ({ data }: IServerExplorerProps) => {
  const router = useRouter()
  const params = useParams()

  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  })

  const onClick = ({ id, type }: CommandItemEventProps) => {
    setOpen(false)

    if (type === EServerExplorerType.Member) {
      router.push(`/servers/${params?.serverId}/chat/${id}`)
    }
    if (type === EServerExplorerType.Channel) {
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="tw-group tw-p-2 tw-rounded-md tw-flex tw-items-center tw-gap-x-2 tw-w-full hover:tw-bg-zinc-700/10 dark:hover:tw-bg-zinc-700/50 tw-transition"
      >
        <Search className="tw-w-4 tw-h-4 tw-text-zinc-500 dark:tw-text-zinc-400" />
        <p className="tw-font-semibold tw-text-sm tw-text-zinc-500 dark:tw-text-zinc-400 group-hover:tw-text-zinc-600 dark:group-hover:tw-text-zinc-300 tw-transition">
          Search
        </p>
        <kbd className="tw-leading-none tw-pointer-events-none tw-inline-flex tw-h-5 tw-select-none tw-items-center tw-gap-1 tw-rounded tw-border tw-bg-muted tw-p-2 tw-font-mono tw-text-[10px] tw-font-medium tw-text-muted-foreground tw-ml-auto">
          <span className="tw-text-[12px]">CTRL /</span> <span className="tw-text-[10px]">⌘</span> +{' '}
          <span className="tw-text-sm">K</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {data.map(({ label, type, data }) => {
            if (!data.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem key={id} autoFocus={false} onSelect={() => onClick({ id, type })}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export default ServerExplorer
