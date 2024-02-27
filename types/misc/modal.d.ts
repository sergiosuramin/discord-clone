import { Server } from '@prisma/client'

// value must match with EModalType
type TModalType = 'createServer' | 'invite' | 'editServer'

interface IModalData {
  server?: Server
}

interface IModalStore {
  type: TModalType | null
  data: IModalData
  isOpen: boolean
  onOpen: (type: TModalType, data?: IModalData) => void
  onClose: () => void
}
