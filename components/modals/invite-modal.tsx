import axios from 'axios'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrigin } from '@/hooks/misc'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { EModalType } from '@/types/enums'

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal()
  const origin = useOrigin()
  const { server } = data

  const isModalOpen = isOpen && type === EModalType.InviteToServer

  const [copied, setCopied] = useState<boolean>(false)
  const [isloading, setIsLoading] = useState<boolean>(false)

  // this invite code will automatically refreshed after we run patch() in onNew()
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    // TODO: add toast

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const onNew = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

      onOpen(EModalType.InviteToServer, { server: response.data })
    } catch (error) {
      console.log('lala-- <create new link>--', error)
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tw-bg-white tw-text-black !tw-p-0 tw-overflow-hidden">
        <DialogHeader className="tw-pt-8 tw-px-6">
          <DialogTitle className="tw-text-2xl tw-text-center tw-font-bold">Invite Friends</DialogTitle>
        </DialogHeader>

        <div className="tw-p-6">
          <Label className="tw-uppercase tw-text-xs tw-font-bold tw-text-zinc-500 dark:tw-text-secondary/70">
            Server Invite Link
          </Label>

          <div className="tw-flex tw-items-center tw-mt-2 tw-gap-x-2">
            <Input
              className="tw-bg-zinc-300/50 tw-border-0 tw-text-black focus-visible:tw-ring-0 focus-visible:tw-ring-offset-0"
              value={inviteUrl}
              onChange={() => {}}
              disabled={isloading}
            />

            <Button size="icon" onClick={onCopy} disabled={isloading}>
              {copied ? <Check className="tw-w-4 tw-h-4" /> : <Copy className="tw-w-4 tw-h-4" />}
            </Button>
          </div>

          <Button
            variant="link"
            size="sm"
            onClick={onNew}
            className="tw-xs tw-text-zinc-500 tw-mt-4"
            disabled={isloading}
          >
            Generate a new link
            <RefreshCw className="tw-w-4 tw-h-4 tw-ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal
