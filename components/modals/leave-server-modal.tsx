import axios, { AxiosError } from 'axios'
import { AlertTriangle } from 'lucide-react'
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

export const LeaveServerModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()
  const { server } = data

  const isModalOpen = isOpen && type === EModalType.LeaveServer

  const [isloading, setIsLoading] = useState<boolean>(false)

  const onLeaveServer = async () => {
    try {
      setIsLoading(true)

      const res = await axios.patch(`/api/servers/${server?.id}/leave`)

      if (res.status === 200) {
        toast.success(`You have left ${server?.name}!`)

        onClose()
        router.refresh()
        router.push('/')
      } else {
        toast.error('Failed to leave server')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data ?? 'Failed to leave server')
      }
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Leave Server</DialogTitle>
          <DialogDescription className="tw-text-center tw-text-zinc-500">
            Are you sure you want to leave <span className="tw-font-semibold tw-text-indigo-500">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="tw-p-6 tw-flex tw-flex-col tw-items-center tw-gap-y-4">
          <AlertTriangle className="tw-bg-destructive" size={72} />
          <span className="tw-text-muted-foreground tw-text-xs tw-text-center">
            You must request admin&apos;s invitation again to join.
          </span>
        </div>

        <DialogFooter className="tw-bg-gray-100 tw-px-6 tw-py-4">
          <div className="tw-flex tw-justify-end tw-items-center tw-gap-x-2 tw-w-full">
            <Button disabled={isloading} variant="ghost" onClick={() => onClose()}>
              Cancel
            </Button>

            <Button disabled={isloading} variant="destructive" onClick={() => onLeaveServer()}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal
