import axios, { AxiosError } from 'axios'
import { Eraser } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

export const DeleteServerModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()
  const { server } = data

  const isModalOpen = isOpen && type === EModalType.DeleteServer

  const [isloading, setIsLoading] = useState<boolean>(false)

  const onDelete = async () => {
    try {
      setIsLoading(true)

      const res = await axios.delete(`/api/servers/${server?.id}`)

      if (res.status === 200) {
        toast.success('Server has been deleted!')

        onClose()
        router.refresh()
        router.push('/')
      } else {
        toast.error('Failed to delete server')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data ?? 'Failed to delete')
      }
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Delete Server</DialogTitle>
          <DialogDescription className="tw-text-center tw-text-zinc-500">
            Are you sure you want to delete <span className="tw-font-semibold tw-text-indigo-500">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="tw-p-6 tw-flex tw-flex-col tw-items-center tw-gap-y-4">
          <Eraser className="tw-text-destructive dark:tw-text-rose-500" size={72} />
          <span className="tw-text-muted-foreground tw-text-xs tw-text-center">
            This action will remove the server permanently and cannot be undone.
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

export default DeleteServerModal
