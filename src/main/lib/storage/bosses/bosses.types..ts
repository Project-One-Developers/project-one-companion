import { z } from 'zod'
import { bossOverviewSchema } from './bosses.schemas'

export type BossOverview = z.infer<typeof bossOverviewSchema>
