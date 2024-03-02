import { useParams } from 'next/navigation'

export const useCurrentServer = (id?: string) => {
  const params = useParams()

  if (id) {
    // so user can check their logic with isCurrentServer boolean
    return { serverId: params?.serverId, isCurrentServer: params?.serverId === id }
  } else {
    return { serverId: params?.serverId }
  }
}
