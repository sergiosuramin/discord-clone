import { Channel, ChannelType, Server } from '@prisma/client'

// value must match with EModalType
type TModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'
  | 'deleteChannel'
  | 'editChannel'
  | 'messageFile'
  | 'deleteMessage'

interface IModalData {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  query?: Record<string, any>
}

interface IModalStore {
  type: TModalType | null
  data: IModalData
  isOpen: boolean
  onOpen: (type: TModalType, data?: IModalData) => void
  onClose: () => void
}
