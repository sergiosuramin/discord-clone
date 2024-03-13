import { TCompleteChannelMessage } from '@/types/misc'

type TChatResponse = {
  pages: {
    items: TCompleteChannelMessage[]
    nextCursor: string
  }[]
  pageParams: any[]
}
