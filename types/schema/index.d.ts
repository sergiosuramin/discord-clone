import * as z from 'zod'

import { createServerSchema } from '@/lib/zod'

type TCreateServerSchema = z.infer<typeof createServerSchema>
