import { Member, Profile, Server } from '@prisma/client'

// server with member and profiles
type TServerAllProps = Server & {
  members: (Member & { profile: Profile })[]
}
