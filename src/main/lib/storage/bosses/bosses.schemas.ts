import { z } from 'zod'

export const bossOverviewSchema = z.object({ id: z.number(), name: z.string() })
