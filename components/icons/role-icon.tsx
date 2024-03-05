import { MemberRole } from '@prisma/client'
import { Crown, Shield, ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ActionTooltip } from '../action-tooltip'

interface RoleIconProps {
  role: MemberRole
  className?: string
  disableBg?: boolean
  manageUi?: boolean
}

const RoleSvgBg = {
  [MemberRole.ADMIN]: 'tw-text-rose-500',
  [MemberRole.MODERATOR]: 'tw-text-indigo-500',
  [MemberRole.GUEST]: '',
}

export default function RoleIcon({ role, disableBg = false, manageUi = false, className }: RoleIconProps) {
  const finalClassName = cn({ [RoleSvgBg[role]]: !disableBg }, 'tw-w-4 tw-h-4', className)

  const roleIcons = {
    [MemberRole.ADMIN]: <Crown className={finalClassName} />,
    [MemberRole.MODERATOR]: <ShieldCheck className={finalClassName} />,
    [MemberRole.GUEST]: manageUi ? <Shield className={finalClassName} /> : null,
  }

  const icon = roleIcons[role] ?? null

  if (!icon) return null

  return manageUi ? (
    <>{icon}</>
  ) : (
    <ActionTooltip label={role} side="top">
      {icon}
    </ActionTooltip>
  )
}
