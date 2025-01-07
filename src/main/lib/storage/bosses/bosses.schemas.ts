import { bossSchema } from '@shared/schemas/wow.schemas'

export const newBossSchema = bossSchema.omit({ items: true })
