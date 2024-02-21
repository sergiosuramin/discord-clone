type TModalType = 'createServer'

interface IModalStore {
  type: TModalType | null
  isOpen: boolean
  onOpen: (type: TModalType) => void
  onClose: () => void
}
