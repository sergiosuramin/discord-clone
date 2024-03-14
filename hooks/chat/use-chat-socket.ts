import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useSocket } from '@/components/provider/socket-provider'
import { TCompleteChannelMessage } from '@/types/misc'
import { TChatResponse } from '@/types/response'

type ChatSocketProps = {
  addKey: string
  updateKey: string
  queryKey: string
}
// TCompleteChannelMessage

// real time hooks handler
export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }

    // when message is updated/deleted
    socket.on(updateKey, (message: TCompleteChannelMessage) => {
      queryClient.setQueryData([queryKey], (oldData: TChatResponse) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newPagesData = oldData.pages.map(({ items, nextCursor }) => {
          return {
            nextCursor,
            items: items.map((item: TCompleteChannelMessage) => {
              if (item.id === message.id) {
                // found the updated message, the message to replace
                return message
              }

              return item
            }),
          }
        })

        return { ...oldData, pages: newPagesData }
      })
    })

    // when a new message created
    socket.on(addKey, (message: TCompleteChannelMessage) => {
      queryClient.setQueryData([queryKey], (oldData: TChatResponse) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          }
        }

        const newPagesData = [...oldData.pages]

        newPagesData[0] = {
          ...newPagesData[0],
          items: [message, ...newPagesData[0].items],
        }

        return { ...oldData, pages: newPagesData }
      })
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [socket, addKey, updateKey, queryKey, queryClient])
}
