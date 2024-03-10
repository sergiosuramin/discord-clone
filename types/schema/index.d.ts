import * as z from 'zod'

import { createServerSchema, createChannelSchema, chatInputSchema } from '@/lib/zod'

type TCreateServerSchema = z.infer<typeof createServerSchema>

type TCreateChannelSchema = z.infer<typeof createChannelSchema>

type TChatInputSchema = z.infer<typeof chatInputSchema>
