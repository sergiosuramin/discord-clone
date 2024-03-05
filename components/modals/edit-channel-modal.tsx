import { ChannelType } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { zr, createChannelSchema } from '@/lib/zod'
import { EModalType } from '@/types/enums'
import { TCreateChannelSchema } from '@/types/schema'

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === EModalType.EditChannel
  const { channel, server } = data // potential props sent from edit channel in server-sidebar edit icon

  const form = useForm({
    resolver: zr(createChannelSchema),
    defaultValues: {
      name: '',
      type: channel?.type || ChannelType.TEXT,
    },
  })

  useEffect(() => {
    // update the default values if channel exists
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    }
    // isOpen is required, so when we re-open the modal from the same channel, useEffect will be triggered
  }, [isOpen, channel, form])

  const { isSubmitting } = form.formState

  const onSubmit = async (values: TCreateChannelSchema) => {
    try {
      // first, let's simplify our endpoint params and queries.
      const fullEndpoint = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: {
          serverId: server?.id,
        },
      })

      const res = await axios.patch(fullEndpoint, values)

      console.log('lala-- res-- edit channel--', res)

      if (res.status === 200) {
        alert('edit channel Success (todo: replace with toast)')
      } else {
        alert('Failed to channel (todo: replace with toast)')
      }

      onOpenDialogChange()
      router.refresh()
    } catch (error) {
      console.log('lala-- <submit edit channel>--', error)
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
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Edit Channel</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
            <div className="tw-space-y-8 tw-px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tw-uppercase tw-text-xs tw-font-bold tw-text-zinc-500">
                      Channel Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="tw-bg-zinc-300/50 tw-border-0 focus-visible:!tw-ring-0 tw-text-black focus-visible:!tw-ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tw-uppercase tw-text-xs tw-font-bold tw-text-zinc-500">
                      Channel Type
                    </FormLabel>

                    <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="tw-bg-zinc-300/50 tw-border-0 focus:tw-ring-0 focus:tw-ring-offset-0 tw-text-black tw-ring-offset-0 tw-capitalize tw-outline-none">
                          <SelectValue placeholder="Select channel type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type} className="tw-capitalize">
                            <Label className="tw-lowercase">{type}</Label>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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

export default EditChannelModal
