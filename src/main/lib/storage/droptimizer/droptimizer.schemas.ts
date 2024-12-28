import { z } from 'zod'

const upgradesStorageSchema = z.object({
    itemId: z.number(),
    dps: z.number()
})

export const droptimizerStorageSchema = z
    .object({
        id: z.string(),
        url: z.string().url(),
        resultRaw: z.string(),
        date: z.number(),
        raidDifficulty: z.string(),
        fightStyle: z.string(),
        duration: z.number().min(1),
        nTargets: z.number().min(1),
        characterName: z.string(),
        upgrades: z.array(upgradesStorageSchema)
    })
    .transform((data) => {
        return {
            id: data.id,
            url: data.url,
            resultRaw: data.resultRaw,
            date: data.date,
            raidDifficulty: data.raidDifficulty,
            characterName: data.characterName,
            fightInfo: {
                fightstyle: data.fightStyle,
                duration: data.duration,
                nTargets: data.nTargets
            },
            upgrades: data.upgrades.map((up) => ({
                itemId: up.itemId,
                dps: up.dps
            }))
        }
    })
