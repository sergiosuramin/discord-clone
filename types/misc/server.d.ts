import { Channel, ChannelType, Member, MemberRole, Profile, Server } from '@prisma/client'
import { ReactNode } from 'react'

import { EServerExplorerType } from '@/types/enums'

type ServerMember = Member & { profile: Profile }
// server with member and profiles
type TServerAllProps = Server & {
  members: ServerMember[]
}

interface IManageServerMemberProps {
  member: ServerMember
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

interface IServerMemberProps {
  member: ServerMember
  server: Server
}
