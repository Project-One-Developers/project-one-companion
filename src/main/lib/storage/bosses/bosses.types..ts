import { z } from 'zod'
import { newBossSchema } from './bosses.schemas'

export type NewBoss = z.infer<typeof newBossSchema>
