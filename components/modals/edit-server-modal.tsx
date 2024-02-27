import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { zr, createServerSchema } from '@/lib/zod'
import { EModalType } from '@/types/enums'
import { TCreateServerSchema } from '@/types/schema'

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === EModalType.ServerSetting
  const { server } = data

  const form = useForm({
    resolver: zr(createServerSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
  }, [server, form])

  const { isSubmitting } = form.formState

  const onSubmit = async (values: TCreateServerSchema) => {
    try {
      const res = await axios.patch(`/api/servers/${server?.id}`, values)

      console.log('lala-- res edit--', res)

      if (res.status === 200) {
        alert('Create Server Success (todo: replace with toast)')
      } else {
        alert('Failed to Server (todo: replace with toast)')
      }

      onOpenDialogChange()
      router.refresh()
    } catch (error) {
      console.log('lala-- <submit create server>--', error)
    }
  }

  const onOpenDialogChange = () => {
    /** we only need to handle onClose here because
     * we will do onOpen in other folders.
     */

    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenDialogChange}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Create Your Customized Server</DialogTitle>
          <DialogDescription className="tw-text-center tw-text-zinc-500">
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
            <div className="tw-space-y-8 tw-px-6">
              <div className="tw-flex tw-justify-center tw-items-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tw-uppercase tw-text-xs tw-font-bold tw-text-zinc-500">Server Name</FormLabel>

                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="tw-bg-zinc-300/50 tw-border-0 focus-visible:!tw-ring-0 tw-text-black focus-visible:!tw-ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="tw-bg-gray-100 tw-px-6 tw-py-4">
              <Button disabled={isSubmitting} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
