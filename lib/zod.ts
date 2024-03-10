/* eslint-disable quotes */
import { zodResolver } from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client'
import * as z from 'zod'

import { ELockedChannelName } from '@/types/enums'

export { zodResolver as zr }

export const createServerSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required',
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required',
  }),
})

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required',
    })
    .max(15, {
      message: 'Maximum character length is 15',
    })
    .refine((name) => name !== ELockedChannelName.general, {
      message: `Channel name cannot be '${ELockedChannelName.general}'`,
    }),
  type: z.nativeEnum(ChannelType),
})

export const chatInputSchema = z.object({
  content: z.string().min(1),
})
