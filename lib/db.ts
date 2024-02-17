/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'

import { isDev } from '@/config/constant'

declare global {
  var prisma: PrismaClient | undefined
}
export const db = globalThis.prisma || new PrismaClient()

if (isDev) globalThis.prisma = db
