import { bossSchema } from '@shared/schemas/wow.schemas'
import { z } from 'zod'

export const newBossSchema = bossSchema.omit({ items: true })

export const bossOverviewSchema = z.object({ id: z.number(), name: z.string() })
