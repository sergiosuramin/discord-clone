import axios, { AxiosError } from 'axios'
import { Eraser } from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { EModalType } from '@/types/enums'

export const DeleteChannelModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()
  const { server, channel } = data

  const isModalOpen = isOpen && type === EModalType.DeleteChannel

  const [isloading, setIsLoading] = useState<boolean>(false)

  const onDelete = async () => {
    try {
      setIsLoading(true)

      // first, let's simplify our endpoint params and queries.
      const fullEndpoint = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      })

      const res = await axios.delete(fullEndpoint)

      if (res.status === 200) {
        toast.success(`Channel "${channel?.name}" has been deleted!`)

        onClose()
        router.refresh()
        router.push(`/servers/${server?.id}`) // go back to server's root
      } else {
        toast.error('Failed to delete channel')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data ?? 'Failed to delete channel')
      }
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="tw-text-center tw-text-zinc-500">Are you sure?</DialogDescription>
        </DialogHeader>

        <div className="tw-p-6 tw-flex tw-flex-col tw-items-center tw-gap-y-4">
          <Eraser className="tw-text-destructive dark:tw-text-rose-500" size={72} />

          <span className="tw-font-semibold tw-text-indigo-500">
            #{channel?.name}{' '}
            <span className="tw-font-normal tw-text-muted-foreground tw-text-center">will be permanently deleted.</span>
          </span>
        </div>

        <DialogFooter className="tw-bg-gray-100 tw-px-6 tw-py-4">
          <div className="tw-flex tw-justify-end tw-items-center tw-gap-x-2 tw-w-full">
            <Button disabled={isloading} variant="ghost" onClick={() => onClose()}>
              Cancel
            </Button>

            <Button
              disabled={isloading}
              variant="destructive"
              className="dark:tw-bg-rose-500"
              onClick={() => onDelete()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChannelModal
