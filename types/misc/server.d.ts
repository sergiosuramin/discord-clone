import { Member, Profile, Server } from '@prisma/client'

type ServerMember = Member & { profile: Profile }
// server with member and profiles
type TServerAllProps = Server & {
  members: ServerMember[]
}

interface IServerMemberProps {
  member: ServerMember
}
