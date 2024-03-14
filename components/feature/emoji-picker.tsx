'use client'
import {} from 'emoji-mart'
import * as EmojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Smile } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
interface EmojiPickerProps {
  onChange: (value: string) => void
}

// the emoji icon will be served in "native"
type SelectedEmojiProps = Pick<EmojiData.Emoji, 'id' | 'name' | 'keywords'> &
  Pick<EmojiData.Skin, 'native' | 'unified'> & { shortcodes: string }

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile
          aria-controls="emoji-picker"
          className="tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition"
        />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={10}
        className="tw-bg-transparent tw-border-none tw-shadow-none tw-drop-shadow-none tw-mb-16"
      >
        <Picker
          className="tw-max-w-[350px]"
          theme={resolvedTheme}
          data={EmojiData}
          perLine={8}
          onEmojiSelect={(emoji: SelectedEmojiProps) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
