import { MemberRole } from '@prisma/client'

export const useCurrentRole = (role: string) => {
  return {
    isAdmin: role === MemberRole.ADMIN,
    isModerator: role === MemberRole.MODERATOR,
    isGuest: role === MemberRole.GUEST,
  }
}
