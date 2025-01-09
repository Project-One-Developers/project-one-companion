import { droptimizerUpgradeSchema } from '@shared/schemas/simulations.schemas'
import { wowClassSchema, wowRaidDiffSchema } from '@shared/schemas/wow.schemas'
import { z } from 'zod'

export const droptimizerStorageSchema = z
    .object({
        url: z.string().url(),
        ak: z.string(),
        dateImported: z.number(),
        simDate: z.number(),
        simFightStyle: z.string(),
        simDuration: z.number().min(1),
        simNTargets: z.number().min(1),
        simRaidbotInput: z.string(),
        raidId: z.number(),
        raidDifficulty: wowRaidDiffSchema,
        characterName: z.string(),
        characterServer: z.string(),
        characterClass: wowClassSchema,
        characterClassId: z.number(),
        characterSpec: z.string(),
        characterSpecId: z.number(),
        characterTalents: z.string(),
        upgrades: z.array(droptimizerUpgradeSchema)
    })
    .transform((data) => {
        return {
            url: data.url,
            ak: data.ak,
            dateImported: data.dateImported,
            simInfo: {
                date: data.simDate,
                fightstyle: data.simFightStyle,
                duration: data.simDuration,
                nTargets: data.simNTargets,
                raidbotInput: data.simRaidbotInput
            },
            raidInfo: {
                id: data.raidId,
                difficulty: data.raidDifficulty
            },
            charInfo: {
                name: data.characterName,
                server: data.characterServer,
                class: data.characterClass,
                classId: data.characterClassId,
                spec: data.characterSpec,
                specId: data.characterSpecId,
                talents: data.characterTalents
            },
            upgrades: data.upgrades.map((up) => ({
                id: up.id,
                itemId: up.itemId,
                dps: up.dps,
                ilvl: up.ilvl,
                slot: up.slot,
                catalyzedItemId: up.catalyzedItemId,
                droptimizerId: up.droptimizerId
            }))
        }
    })

export const droptimizerListStorageSchema = z.array(droptimizerStorageSchema)
