import { ChannelType, Server } from '@prisma/client'

// value must match with EModalType
type TModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'

interface IModalData {
  server?: Server
  channelType?: ChannelType
}

interface IModalStore {
  type: TModalType | null
  data: IModalData
  isOpen: boolean
  onOpen: (type: TModalType, data?: IModalData) => void
  onClose: () => void
}
