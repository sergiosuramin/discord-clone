import { useEffect, useState } from 'react'

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: () => void
  count: number
}

export const useChatScroll = ({ chatRef, bottomRef, shouldLoadMore, loadMore, count }: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false)

  // listen to the most top message div to trigger the load-more-message
  useEffect(() => {
    const topDiv = chatRef.current

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }

    topDiv?.addEventListener('scroll', handleScroll)

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll)
    }
  }, [shouldLoadMore, loadMore, chatRef])

  // listen after we post a message so we are being scrolled to the bottom
  useEffect(() => {
    const bottomDiv = bottomRef?.current
    const topDiv = chatRef.current

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }

      // technically means we don't have any messages
      if (!topDiv) {
        return false
      }

      // calculate the distance from the bottom
      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      // prevent to scroll back to bottom if we are somewhere in the middle or top
      return distanceFromBottom <= 100
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [bottomRef, hasInitialized, chatRef, count])
}
