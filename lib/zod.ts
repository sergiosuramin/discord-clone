import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export { zodResolver as zr }

export const createServerSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required',
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required',
  }),
})
