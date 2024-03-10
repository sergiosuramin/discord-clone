'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useForm } from 'react-hook-form'

import FileUpload from '@/components/feature/file-upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { zr, attachFileSchema } from '@/lib/zod'
import { EModalType } from '@/types/enums'
import { TAttachFileSchema } from '@/types/schema'

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === EModalType.MessageFile
  const { apiUrl, query } = data

  const form = useForm({
    resolver: zr(attachFileSchema),
    defaultValues: {
      fileUrl: '',
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const { isSubmitting } = form.formState

  const onSubmit = async (values: TAttachFileSchema) => {
    try {
      const fullEndpoint = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      const res = await axios.post(fullEndpoint, {
        ...values,
        content: values.fileUrl,
      })

      console.log('lala-- res--', res)

      if (res.status === 200) {
        alert('Create Server Success (todo: replace with toast)')
      } else {
        alert('Failed to Server (todo: replace with toast)')
      }

      router.refresh()
      handleClose()
    } catch (error) {
      console.log('lala-- <submit create server>--', error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Add an attachment</DialogTitle>
          <DialogDescription className="tw-text-center tw-text-zinc-500">Send file as a message</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
            <div className="tw-space-y-8 tw-px-6">
              <div className="tw-flex tw-justify-center tw-items-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="tw-bg-gray-100 tw-px-6 tw-py-4">
              <Button disabled={isSubmitting} variant="primary">
                Attach and send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal
