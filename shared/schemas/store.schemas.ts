import { z } from 'zod'

export const appSettingsSchema = z.object({
    databaseUrl: z.string().min(1)
})
