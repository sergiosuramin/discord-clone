import { useParams } from 'next/navigation'

export const useCurrentServer = (id: string) => {
  const params = useParams()

  return { serverId: params?.serverId, isCurrentServer: params?.serverId === id }
}
