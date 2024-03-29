import { Skeleton } from '@/components/ui/skeleton'
import { EChatHeaderType } from '@/types/enums'

interface ChatMessageSkeletonProps {
  type: EChatHeaderType
}

const ChatMessageSkeleton = ({ type = EChatHeaderType.Channel }: ChatMessageSkeletonProps) => {
  const skeletonArray = Array.from({ length: 5 })

  return (
    <div className="tw-flex tw-flex-col tw-p-4 tw-gap-y-4">
      {type === EChatHeaderType.Channel && <Skeleton className="tw-w-[75px] tw-h-[75px] !tw-rounded-full" />}

      <div className="tw-space-y-2">
        <Skeleton className="tw-w-[250px] tw-h-4" />
        <Skeleton className="tw-w-[200px] tw-h-4" />
      </div>

      {skeletonArray.map((_, index) => (
        <div key={index} className="tw-w-full tw-flex tw-items-center tw-gap-x-2 tw-mt-2">
          <Skeleton className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 !tw-rounded-full" />

          <div className="tw-grid tw-w-full tw-gap-y-2">
            <Skeleton className="tw-w-[100px] tw-h-4" />
            <Skeleton className="tw-w-[100%] min-[450px]:tw-w-[50%] tw-h-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatMessageSkeleton
