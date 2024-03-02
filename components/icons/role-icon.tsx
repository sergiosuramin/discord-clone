import { MemberRole } from '@prisma/client'
import { Crown, Shield, ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

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
  const finalClassName = cn(disableBg ? '' : RoleSvgBg[role], 'tw-w-4 tw-h-4', className)

  switch (role) {
    case MemberRole.ADMIN:
      return <Crown className={finalClassName} />
    case MemberRole.MODERATOR:
      return <ShieldCheck className={finalClassName} />
    case MemberRole.GUEST:
      return manageUi ? <Shield className={finalClassName} /> : null
  }
}
