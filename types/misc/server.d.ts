import { Channel, ChannelType, Member, MemberRole, Message, Profile, Server } from '@prisma/client'
import { ReactNode } from 'react'

import { EServerExplorerType } from '@/types/enums'

type TServerMemberWithProfile = Member & { profile: Profile }
// server with member and profiles
type TServerAllProps = Server & {
  members: TServerMemberWithProfile[]
}

type TServerExplorerDataProps = {
  icon: ReactNode
  name: string
  id: string
}

interface IServerExplorerProps {
  data: {
    label: string
    type: EServerExplorerType
    data: TServerExplorerDataProps[] | undefined
  }[]
}

interface IServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: EServerExplorerType
  channelType?: ChannelType
  server?: TServerAllProps
}

interface IServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}

type TServerMemberProps = {
  member: TServerMemberWithProfile
  server: Server
}

type TManageServerMemberProps = Pick<TServerMemberProps, 'member'>

type TCompleteChannelMessage = Message & {
  member: TServerMemberWithProfile
}
