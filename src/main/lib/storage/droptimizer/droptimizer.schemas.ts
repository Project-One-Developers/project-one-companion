import { droptimizerUpgradeSchema } from '@shared/schemas/simulations.schemas'
import { z } from 'zod'

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
        upgrades: z.array(droptimizerUpgradeSchema)
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
                id: up.id,
                itemId: up.itemId,
                dps: up.dps,
                slot: up.slot,
                catalyzedItemId: up.catalyzedItemId,
                droptimizerId: up.droptimizerId
            }))
        }
    })

export const droptimizerListStorageSchema = z.array(droptimizerStorageSchema)
