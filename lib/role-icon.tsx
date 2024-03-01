import { MemberRole } from '@prisma/client'
import { Crown, Shield, ShieldCheck } from 'lucide-react'

import { cn } from './utils'

interface RoleIconProps {
  role: MemberRole
  className?: string
  disableBg?: boolean
  manageUi?: boolean
}

const RoleSvgBg = {
  [MemberRole.ADMIN]: 'tw-text-rose-500',
  [MemberRole.MODERATOR]: 'tw-text-emerald-500',
  [MemberRole.GUEST]: '',
}

export default function RoleIcon({ role, disableBg = false, manageUi = false, className }: RoleIconProps) {
  const finalClassName = cn(disableBg ? '' : RoleSvgBg[role], className)

  switch (role) {
    case MemberRole.ADMIN:
      return <Crown className={`tw-w-4 tw-h-4 ${finalClassName}`} />
    case MemberRole.MODERATOR:
      return <ShieldCheck className={`tw-w-4 tw-h-4 ${finalClassName}`} />
    case MemberRole.GUEST:
      return manageUi ? <Shield className={`tw-w-4 tw-h-4 ${finalClassName}`} /> : null
  }
}
