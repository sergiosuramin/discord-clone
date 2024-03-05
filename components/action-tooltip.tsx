'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ActionTooltipProps {
  label: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'left' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export const ActionTooltip = ({ label, children, side, align, sideOffset = 4 }: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild className="tw-cursor-pointer">
          {children}
        </TooltipTrigger>

        <TooltipContent side={side} align={align} sideOffset={sideOffset}>
          <p className="tw-text-semibold tw-text-sm tw-capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
