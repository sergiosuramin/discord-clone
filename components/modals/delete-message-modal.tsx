import axios from 'axios'
import { Eraser } from 'lucide-react'
import qs from 'query-string'
import { useState } from 'react'

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

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { apiUrl, query } = data

  const isModalOpen = isOpen && type === EModalType.DeleteMessage

  const [isloading, setIsLoading] = useState<boolean>(false)

  const onDelete = async () => {
    try {
      setIsLoading(true)

      // first, let's simplify our endpoint params and queries.
      const fullEndpoint = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      const res = await axios.delete(fullEndpoint)

      console.log('lala-- res Delete message--', res)

      if (res.status === 200) {
        alert('Delete Message Success (todo: replace with toast)')
      } else {
        alert('Failed to Message Channel (todo: replace with toast)')
      }

      onClose()
    } catch (error) {
      console.log('<delete_message>', error)
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Delete Message</DialogTitle>
        </DialogHeader>

        <div className="tw-p-6 tw-flex tw-flex-col tw-items-center tw-gap-y-4">
          <Eraser className="tw-text-destructive dark:tw-text-rose-500" size={72} />

          <DialogDescription className="tw-text-center tw-text-zinc-500">
            Are you sure? <br /> This action cannot be undone.
          </DialogDescription>
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

export default DeleteMessageModal
