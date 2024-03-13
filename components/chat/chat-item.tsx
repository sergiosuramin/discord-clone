'use client'

import { Member } from '@prisma/client'
import axios from 'axios'
import { Edit, FileIcon, SendHorizonal, Trash } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ActionTooltip } from '@/components/feature/action-tooltip'
import EmojiPicker from '@/components/feature/emoji-picker'
import UserAvatar from '@/components/feature/user-avatar'
import UserDisplay from '@/components/feature/user-display'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCurrentRole } from '@/hooks/misc'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { cn } from '@/lib/utils'
import { chatInputSchema, zr } from '@/lib/zod'
import { EChatEditorTrigger, EModalType } from '@/types/enums'
import { TServerMemberWithProfile } from '@/types/misc'
import { TChatInputSchema } from '@/types/schema'

interface ChatItemProps {
  id: string
  content: string
  member: TServerMemberWithProfile // the interlocutor
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member // current member is the one who logged in
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const router = useRouter()
  const params = useParams()
  const { onOpen } = useModal()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const fileType = fileUrl?.split('.').pop()

  const { isAdmin, isModerator } = useCurrentRole(currentMember.role)
  const isOwner = currentMember.id === member.id // owner is the one who posted the chat
  const deleteable = !deleted && (isAdmin || isModerator || isOwner) // who can delete a message
  const editable = !deleted && isOwner && !fileUrl // which message can be edited
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  const form = useForm<TChatInputSchema>({
    resolver: zr(chatInputSchema),
    defaultValues: {
      content: content,
    },
  })

  const onMemberClick = () => {
    if (isOwner) {
      // no event when clicking ourselves
      return
    }

    router.push(`/servers/${params?.serverId}/chat/${member.id}`)
  }

  // this event is triggered through click event
  const onTriggerEditor = (type: EChatEditorTrigger) => {
    if (type === EChatEditorTrigger.EDIT) {
      setIsEditing(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event?: KeyboardEvent) => {
      if (event.key === 'Escape' || event.code === 'Escape') {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // ensure to have the last message to edit since we have real-time-ish feature
  useEffect(() => {
    form.reset({
      content: content,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values: TChatInputSchema) => {
    try {
      const fullEndpoint = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(fullEndpoint, values)
      setIsEditing(false)
      form.reset()
    } catch (error) {
      console.log('[patch_message_send_fail]', error)
    }
  }

  return (
    <div className="tw-relative tw-group tw-flex tw-items-center hover:tw-bg-black/10 tw-p-4 tw-transition tw-w-full">
      <div className="tw-group tw-flex tw-gap-x-2 tw-items-start tw-w-full">
        <div onClick={onMemberClick}>
          <UserAvatar
            src={member.profile.imageUrl}
            fallback={member.profile.name}
            className={!isOwner ? 'tw-cursor-pointer' : ''}
          />
        </div>

        <div className="tw-flex tw-flex-col tw-w-full">
          <div className="tw-flex tw-flex-col min-[450px]:tw-flex-row min-[450px]:tw-items-center tw-gap-x-2 tw-mb-2">
            <UserDisplay member={member} onClick={onMemberClick} isOurselves={isOwner} isChat />
            <span className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-500">{timestamp}</span>
          </div>

          {/* render the chat content based on what the user sent */}
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tw-relative tw-aspect-square tw-rounded-md tw-overflow-hidden tw-flex tw-items-center tw-bg-secondary tw-w-48 tw-h-48"
            >
              <Image fill src={fileUrl} alt={content} className="tw-object-cover" />
            </a>
          )}

          {isPDF && (
            <div className="tw-relative tw-flex tw-items-center tw-p-2 tw-mt-2 tw-rounded-md tw-bg-zinc-500/10 dark:tw-bg-background/10">
              <FileIcon className="tw-w-10 tw-h-10 tw-fill-indigo-200 tw-stroke-indigo-400" />

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tw-ml-2 tw-text-sm tw-text-indigo-500 dark:tw-text-indigo-400 hover:tw-underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'tw-text-sm tw-text-zinc-600 dark:tw-text-zinc-300',
                deleted &&
                  'tw-text-zinc-500 dark:tw-text-zinc-400 tw-italic tw-opacity-70 dark:tw-opacity-50 tw-text-xs tw-mt-1'
              )}
            >
              {!deleted ? content : 'This message has been deleted'}
              {isUpdated && !deleted && (
                <span className="tw-text-[10px] tw-mx-2 tw-text-zinc-500 dark:tw-text-zinc-400 tw-opacity-70">
                  (edited)
                </span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="tw-relative">
                          <Input
                            disabled={isSubmitting}
                            className="!tw-pr-[68px] !tw-py-6 tw-bg-zinc-200/90 dark:tw-bg-zinc-700/75 tw-border-none tw-border-0 focus-visible:!tw-ring-0 focus-visible:!tw-ring-offset-0 tw-text-zinc-600 dark:tw-text-zinc-200"
                            placeholder="Enter your message"
                            {...field}
                          />

                          <button
                            type="submit"
                            className="tw-absolute tw-top-3 tw-right-10 tw-h-[24px] tw-w-[24px] tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
                            disabled={isSubmitting}
                          >
                            <SendHorizonal className="tw-h-[16px] tw-w-[16px] tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition" />
                          </button>

                          <div className="tw-absolute tw-top-3 tw-right-3">
                            <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
              <span className="tw-text-[10px] tw-mt-1 tw-text-zinc-400">
                Press escape to{' '}
                <span
                  className="tw-text-sky-500 dark:tw-text-sky-400 tw-underline tw-cursor-pointer"
                  onClick={() => onTriggerEditor(EChatEditorTrigger.EDIT)}
                >
                  cancel
                </span>
                , enter to{' '}
                <span
                  className="tw-text-sky-500 dark:tw-text-sky-400 tw-underline tw-cursor-pointer"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  save
                </span>
                .
              </span>
            </Form>
          )}
        </div>
      </div>

      {deleteable && (
        <div className="tw-hidden group-hover:tw-flex tw-items-center tw-gap-x-2 tw-absolute tw-p-1 -tw-top-2 tw-right-5 tw-bg-white dark:tw-bg-zinc-800 tw-border tw-rounded-sm">
          {editable && (
            <ActionTooltip label="Edit" side="top">
              <Edit
                className="tw-cursor-pointer tw-w-4 tw-h-4 tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}

          <ActionTooltip label="Delete" side="top">
            <Trash
              className="tw-cursor-pointer  tw-w-4 tw-h-4 tw-text-rose-500 dark:tw-text-rose-400 hover:tw-text-rose-600 dark:hover:tw-text-rose-300 tw-transition"
              onClick={() => onOpen(EModalType.DeleteMessage, { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
