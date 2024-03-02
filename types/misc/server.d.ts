import { Member, Profile, Server } from '@prisma/client'
import { ReactNode } from 'react'

import { EServerExplorerType } from '@/types/enums'

type ServerMember = Member & { profile: Profile }
// server with member and profiles
type TServerAllProps = Server & {
  members: ServerMember[]
}

interface IServerMemberProps {
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
