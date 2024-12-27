import { z } from 'zod'

export const droptimizerUpgradeSchema = z.object({
    dps: z.number(),
    itemId: z.number()
})

export const droptimizerSchema = z.object({
    id: z.string(),
    url: z.string().url(),
    resultRaw: z.string(),
    date: z.number(),
    raidDifficulty: z.string(),
    characterName: z.string(),
    fightInfo: z.object({
        fightstyle: z.string(),
        duration: z.number().min(1),
        nTargets: z.number().min(1)
    }),
    upgrades: z.array(droptimizerUpgradeSchema).nullable()
})

export const newDroptimizerSchema = droptimizerSchema.omit({ id: true, upgrades: true }).extend({
    upgrades: z.array(
        z.object({
            encounterId: z.number(),
            itemId: z.number(),
            dps: z.number()
        })
    )
})

export const raidbotsURLSchema = z
    .string()
    .url()
    .refine((url) => url.includes('raidbots.com/simbot/report'), {
        message: 'URL must be a raidbots.com report URL'
    })
    .brand('RaidbotsURL')
