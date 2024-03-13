'use client'
import axios from 'axios'
import { Plus, SendHorizonal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useForm } from 'react-hook-form'

import EmojiPicker from '@/components/feature/emoji-picker'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { chatInputSchema, zr } from '@/lib/zod'
import { EChatHeaderType, EModalType } from '@/types/enums'
import { TChatInputSchema } from '@/types/schema'

interface ChatInputProps {
  apiUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any>
  name: string
  type: EChatHeaderType
}

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const router = useRouter()
  console.log('lala-- unusued props now in chat input--', name, type)
  const { onOpen } = useModal()
  const form = useForm<TChatInputSchema>({
    resolver: zr(chatInputSchema),
    defaultValues: {
      content: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values: TChatInputSchema) => {
    try {
      const fullEndpoint = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(fullEndpoint, values)

      form.reset()
      router.refresh()
    } catch (error) {
      console.log('[message_send_fail]', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="tw-relative tw-p-4">
                  <button
                    type="button"
                    onClick={() => onOpen(EModalType.MessageFile, { apiUrl, query })}
                    className="tw-absolute tw-top-7 tw-left-8 tw-h-[24px] tw-w-[24px] tw-bg-zinc-500 dark:tw-bg-zinc-400 hover:tw-bg-zinc-600 dark:hover:tw-bg-zinc-300 tw-transition tw-rounded-full tw-p-1 tw-flex tw-items-center tw-justify-center"
                  >
                    <Plus className="tw-text-white dark:tw-text-chatHeader" />
                  </button>

                  <Input
                    disabled={isSubmitting}
                    className="!tw-pl-14 !tw-pr-24 !tw-py-6 tw-bg-zinc-200/90 dark:tw-bg-zinc-700/75 tw-border-none tw-border-0 focus-visible:!tw-ring-0 focus-visible:!tw-ring-offset-0 tw-text-zinc-600 dark:tw-text-zinc-200"
                    placeholder="Enter your message"
                    {...field}
                  />

                  <button
                    type="submit"
                    className="tw-absolute tw-top-7 tw-right-16 tw-h-[24px] tw-w-[24px] tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <SendHorizonal className="tw-h-[16px] tw-w-[16px] tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition" />
                  </button>

                  <div className="tw-absolute tw-top-7 tw-right-8 ">
                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
