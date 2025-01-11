import { z } from 'zod'
import { bossOverviewSchema, newBossSchema } from './bosses.schemas'

export type NewBoss = z.infer<typeof newBossSchema>

export type BossOverview = z.infer<typeof bossOverviewSchema>
