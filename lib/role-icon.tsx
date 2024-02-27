import { MemberRole } from '@prisma/client'
import { Crown, ShieldCheck } from 'lucide-react'

export const RoleIcon = {
  [MemberRole.ADMIN]: <Crown className="tw-w-4 tw-h-4 tw-text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="tw-w-4 tw-h-4 !tw-text-indigo-500" />,
  [MemberRole.GUEST]: null,
}
