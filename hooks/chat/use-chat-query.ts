'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { useSocket } from '@/components/provider/socket-provider'
import { EChatParamKey } from '@/types/enums'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: EChatParamKey
  paramValue: string
}

// interface NextPageParamsProps {
//   lastPage: {
//     cursor: string | number
//   }
// }

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = undefined }) => {
    const fullEndpoint = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    )

    const res = await fetch(fullEndpoint)
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000, // refetch only when socket has problem as a fallback
    initialPageParam: undefined, // Set initialPageParam to undefined
  })

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status }
}
