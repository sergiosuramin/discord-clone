'use client'

import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zr, createServerSchema } from '@/lib/zod'
import { TCreateServerSchema } from '@/types/schema'

export const InitialModal = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm({
    resolver: zr(createServerSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: TCreateServerSchema) => {
    try {
      const res = await axios.post('/api/servers', values)

      if (res.status === 200) {
        toast.success('Server successfully created!')

        form.reset()
        router.refresh()
        window.location.reload()
      } else {
        toast.error('Failed to create the server')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data ?? 'Failed to create server')
      }
    }
  }

  // to prevent hydration caused by SSR
  if (!mounted) return null

  return (
    <Dialog open>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Create Your First Server!</DialogTitle>
          <DialogDescription className="tw-text-center tw-text-zinc-500">
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <span className="tw-text-center tw-text-xs tw-text-zinc-500/40 tw-mb-4">This action is mandatory.</span>
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default InitialModal
