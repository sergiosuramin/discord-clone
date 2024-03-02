import { MemberRole } from '@prisma/client'
import axios from 'axios'
import { Check, Gavel, Loader2, MoreVertical, ShieldQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'

import { ActionTooltip } from '@/components/action-tooltip'
import { RoleIcon } from '@/components/icons'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/user-avatar'
import { useCurrentRole } from '@/hooks/misc'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { getInitials } from '@/lib/function'
import { EModalType } from '@/types/enums'
import { TManageServerMemberProps, TServerAllProps } from '@/types/misc'

interface IServerWithMembersWithProfile {
  server: TServerAllProps
}

export const ManageMemberModal = () => {
  const router = useRouter()
  const { isOpen, onOpen, onClose, type, data } = useModal()
  const [loadingId, setLoadingId] = useState<string>('') // loading state for selected member

  // our server data will also be updated after we manage any member from PATCH
  const { server } = data as IServerWithMembersWithProfile

  const isModalOpen = isOpen && type === EModalType.ManageMembers

  const onKickMember = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      // call api to change the member role

      // first, let's simplify our endpoint params and queries.
      const fullEndpoint = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      // let's update the user's role
      const response = await axios.delete(fullEndpoint)

      // then, refresh the component and update the state
      router.refresh()
      onOpen(EModalType.ManageMembers, { server: response.data })
    } catch (error) {
      console.log('[on_kick_member]', error)
    } finally {
      setLoadingId('')
    }
  }

  const onRoleChange = async (memberId: string, newRole: MemberRole) => {
    try {
      setLoadingId(memberId)
      // call api to change the member role

      // first, let's simplify our endpoint params and queries.
      const fullEndpoint = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      // let's update the user's role
      const response = await axios.patch(fullEndpoint, { newRole })

      // then, refresh the component and update the state
      router.refresh()
      onOpen(EModalType.ManageMembers, { server: response.data })
    } catch (error) {
      console.log('[on_role_change]', error)
    } finally {
      setLoadingId('')
    }
  }

  const ManageMemberDropdown = ({ member }: TManageServerMemberProps) => {
    const { isModerator, isGuest } = useCurrentRole(member.role)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="tw-cursor-pointer">
          <MoreVertical className="tw-w-4 tw-h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="left">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="tw-flex tw-items-center">
              <ShieldQuestion className="tw-w-4 tw-h-4 tw-mr-2" />
              <span>Role</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={7}>
                <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.GUEST)}>
                  <RoleIcon role={MemberRole.GUEST} disableBg manageUi className="tw-mr-2" />
                  <span>Guest</span>
                  {/* to let us know the user role is guest */}
                  {isGuest && <Check className="tw-w-4 tw-h-4 tw-ml-auto" />}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.MODERATOR)}>
                  <RoleIcon role={MemberRole.MODERATOR} disableBg manageUi className="tw-mr-2" />
                  <span>Moderator</span>
                  {/* to let us know the user role is moderator */}
                  {isModerator && <Check className="tw-w-4 tw-h-4 tw-ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem type="danger" onClick={() => onKickMember(member.id)}>
            <Gavel className="tw-w-4 tw-h-4 tw-mr-2" />
            <span>Kick</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tw-bg-white tw-text-black tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Manage Members</DialogTitle>

          <DialogDescription className="tw-text-center tw-text-zinc-500">
            {server?.members?.length ?? 0} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="tw-mt-8 tw-max-h-[420px] tw-pr-6">
          {server?.members?.map((member) => (
            <div key={`${member.id}`} className="tw-flex tw-items-center tw-gap-x-2 tw-mb-6">
              <UserAvatar src={member?.profile?.imageUrl} fallback={getInitials(member?.profile?.name)} />

              <div className="tw-flex tw-flex-col tw-gap-y-1">
                <div className="tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-x-1">
                  <span>{member?.profile?.name ?? ''}</span>
                  <ActionTooltip label={member?.role ?? ''} side="top" align="center">
                    <RoleIcon role={member.role} />
                  </ActionTooltip>
                </div>

                <p className="tw-text-sm tw-text-zinc-500">{member?.profile?.email ?? ''}</p>
              </div>

              {/* render this to non-admin member */}
              {server.profileId !== member.profileId && loadingId !== member.id && (
                <div className="tw-ml-auto">
                  <ManageMemberDropdown member={member} />
                </div>
              )}

              {/* add spinner to let us know we are doing something to the member */}
              {loadingId === member.id && (
                <Loader2 className="tw-animate-spin tw-text-zinc-500 tw-w-4 tw-h-4 tw-ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ManageMemberModal
