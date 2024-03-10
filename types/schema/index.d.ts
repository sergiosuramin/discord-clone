import * as z from 'zod'

import { createServerSchema, createChannelSchema, chatInputSchema, attachFileSchema } from '@/lib/zod'

type TCreateServerSchema = z.infer<typeof createServerSchema>

type TCreateChannelSchema = z.infer<typeof createChannelSchema>

type TChatInputSchema = z.infer<typeof chatInputSchema>

type TAttachFileSchema = z.infer<typeof attachFileSchema>
