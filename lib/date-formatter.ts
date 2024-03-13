import { format } from 'date-fns'

export const formatChatTimestamp = (dateToFormat: Date | string) => {
  if (!dateToFormat) return null

  return format(new Date(dateToFormat), 'd MMM yyyy, HH:mm')
}
