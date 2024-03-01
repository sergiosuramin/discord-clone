import * as z from 'zod'

import { createServerSchema, createChannelSchema } from '@/lib/zod'

type TCreateServerSchema = z.infer<typeof createServerSchema>

type TCreateChannelSchema = z.infer<typeof createChannelSchema>
