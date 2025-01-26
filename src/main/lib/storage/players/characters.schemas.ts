import { CharacterWowAudit } from '@shared/types/types'
import { z } from 'zod'

export type NewCharacterWowAudit = z.infer<typeof charWowAuditStorageSchema>

export const charWowAuditStorageSchema = z.object({
    name: z.string().max(24),
    realm: z.string(),
    race: z.string().nullable(),
    guildRank: z.string().nullable(),
    characterId: z.number(),
    blizzardLastModifiedUnixTs: z.number(),
    wowauditLastModifiedUnixTs: z.number(),
    weekMythicDungeons: z.number().nullable(),
    emptySockets: z.number().nullable(),
    enchantQualityWrist: z.number().nullable(),
    enchantQualityLegs: z.number().nullable(),
    enchantQualityMainHand: z.number().nullable(),
    enchantQualityOffHand: z.number().nullable(),
    enchantQualityFinger1: z.number().nullable(),
    enchantQualityFinger2: z.number().nullable(),
    enchantQualityBack: z.number().nullable(),
    enchantQualityChest: z.number().nullable(),
    enchantQualityFeet: z.number().nullable(),
    greatVaultSlot1: z.number().nullable(),
    greatVaultSlot2: z.number().nullable(),
    greatVaultSlot3: z.number().nullable(),
    greatVaultSlot4: z.number().nullable(),
    greatVaultSlot5: z.number().nullable(),
    greatVaultSlot6: z.number().nullable(),
    greatVaultSlot7: z.number().nullable(),
    greatVaultSlot8: z.number().nullable(),
    greatVaultSlot9: z.number().nullable(),
    tiersetHeadIlvl: z.number().nullable(),
    tiersetShouldersIlvl: z.number().nullable(),
    tiersetChestIlvl: z.number().nullable(),
    tiersetHandsIlvl: z.number().nullable(),
    tiersetLegsIlvl: z.number().nullable(),
    tiersetHeadDiff: z.string().nullable(),
    tiersetShouldersDiff: z.string().nullable(),
    tiersetChestDiff: z.string().nullable(),
    tiersetHandsDiff: z.string().nullable(),
    tiersetLegsDiff: z.string().nullable(),
    highestIlvlEverEquipped: z.string().nullable(),
    bestHeadIlvl: z.number().nullable(),
    bestHeadId: z.number().nullable(),
    bestHeadName: z.string().nullable(),
    bestHeadQuality: z.number().nullable(),
    bestNeckIlvl: z.number().nullable(),
    bestNeckId: z.number().nullable(),
    bestNeckName: z.string().nullable(),
    bestNeckQuality: z.number().nullable(),
    bestShoulderIlvl: z.number().nullable(),
    bestShoulderId: z.number().nullable(),
    bestShoulderName: z.string().nullable(),
    bestShoulderQuality: z.number().nullable(),
    bestBackIlvl: z.number().nullable(),
    bestBackId: z.number().nullable(),
    bestBackName: z.string().nullable(),
    bestBackQuality: z.number().nullable(),
    bestChestIlvl: z.number().nullable(),
    bestChestId: z.number().nullable(),
    bestChestName: z.string().nullable(),
    bestChestQuality: z.number().nullable(),
    bestWristIlvl: z.number().nullable(),
    bestWristId: z.number().nullable(),
    bestWristName: z.string().nullable(),
    bestWristQuality: z.number().nullable(),
    bestHandsIlvl: z.number().nullable(),
    bestHandsId: z.number().nullable(),
    bestHandsName: z.string().nullable(),
    bestHandsQuality: z.number().nullable(),
    bestWaistIlvl: z.number().nullable(),
    bestWaistId: z.number().nullable(),
    bestWaistName: z.string().nullable(),
    bestWaistQuality: z.number().nullable(),
    bestLegsIlvl: z.number().nullable(),
    bestLegsId: z.number().nullable(),
    bestLegsName: z.string().nullable(),
    bestLegsQuality: z.number().nullable(),
    bestFeetIlvl: z.number().nullable(),
    bestFeetId: z.number().nullable(),
    bestFeetName: z.string().nullable(),
    bestFeetQuality: z.number().nullable(),
    bestFinger1Ilvl: z.number().nullable(),
    bestFinger1Id: z.number().nullable(),
    bestFinger1Name: z.string().nullable(),
    bestFinger1Quality: z.number().nullable(),
    bestFinger2Ilvl: z.number().nullable(),
    bestFinger2Id: z.number().nullable(),
    bestFinger2Name: z.string().nullable(),
    bestFinger2Quality: z.number().nullable(),
    bestTrinket1Ilvl: z.number().nullable(),
    bestTrinket1Id: z.number().nullable(),
    bestTrinket1Name: z.string().nullable(),
    bestTrinket1Quality: z.number().nullable(),
    bestTrinket2Ilvl: z.number().nullable(),
    bestTrinket2Id: z.number().nullable(),
    bestTrinket2Name: z.string().nullable(),
    bestTrinket2Quality: z.number().nullable(),
    bestMainHandIlvl: z.number().nullable(),
    bestMainHandId: z.number().nullable(),
    bestMainHandName: z.string().nullable(),
    bestMainHandQuality: z.number().nullable(),
    bestOffHandIlvl: z.number().nullable(),
    bestOffHandId: z.number().nullable(),
    bestOffHandName: z.string().nullable(),
    bestOffHandQuality: z.number().nullable()
})

export const charWowAuditStorageToCharacterWowAudit = charWowAuditStorageSchema.transform(
    (data): CharacterWowAudit => ({
        name: data.name,
        realm: data.realm,
        race: data.race,
        guildRank: data.guildRank,
        characterId: data.characterId,
        blizzardLastModifiedUnixTs: data.blizzardLastModifiedUnixTs,
        wowauditLastModifiedUnixTs: data.wowauditLastModifiedUnixTs,
        weekMythicDungeons: data.weekMythicDungeons,
        emptySockets: data.emptySockets,
        hightestIlvlEverEquipped: data.highestIlvlEverEquipped,
        enchant: {
            wrist: data.enchantQualityWrist,
            legs: data.enchantQualityLegs,
            mainHand: data.enchantQualityMainHand,
            offHand: data.enchantQualityOffHand,
            finger1: data.enchantQualityFinger1,
            finger2: data.enchantQualityFinger2,
            back: data.enchantQualityBack,
            chest: data.enchantQualityChest,
            feet: data.enchantQualityFeet
        },
        greatVault: {
            slot1: data.greatVaultSlot1,
            slot2: data.greatVaultSlot2,
            slot3: data.greatVaultSlot3,
            slot4: data.greatVaultSlot4,
            slot5: data.greatVaultSlot5,
            slot6: data.greatVaultSlot6,
            slot7: data.greatVaultSlot7,
            slot8: data.greatVaultSlot8,
            slot9: data.greatVaultSlot9
        },
        tierset: {
            headIlvl: data.tiersetHeadIlvl,
            shouldersIlvl: data.tiersetShouldersIlvl,
            chestIlvl: data.tiersetChestIlvl,
            handsIlvl: data.tiersetHandsIlvl,
            legsIlvl: data.tiersetLegsIlvl,
            headDiff: data.tiersetHeadDiff,
            shouldersDiff: data.tiersetShouldersDiff,
            chestDiff: data.tiersetChestDiff,
            handsDiff: data.tiersetHandsDiff,
            legsDiff: data.tiersetLegsDiff
        },
        bestGear: {
            head: {
                ilvl: data.bestHeadIlvl,
                id: data.bestHeadId,
                name: data.bestHeadName,
                quality: data.bestHeadQuality
            },
            neck: {
                ilvl: data.bestNeckIlvl,
                id: data.bestNeckId,
                name: data.bestNeckName,
                quality: data.bestNeckQuality
            },
            shoulder: {
                ilvl: data.bestShoulderIlvl,
                id: data.bestShoulderId,
                name: data.bestShoulderName,
                quality: data.bestShoulderQuality
            },
            back: {
                ilvl: data.bestBackIlvl,
                id: data.bestBackId,
                name: data.bestBackName,
                quality: data.bestBackQuality
            },
            chest: {
                ilvl: data.bestChestIlvl,
                id: data.bestChestId,
                name: data.bestChestName,
                quality: data.bestChestQuality
            },
            wrist: {
                ilvl: data.bestWristIlvl,
                id: data.bestWristId,
                name: data.bestWristName,
                quality: data.bestWristQuality
            },
            hands: {
                ilvl: data.bestHandsIlvl,
                id: data.bestHandsId,
                name: data.bestHandsName,
                quality: data.bestHandsQuality
            },
            waist: {
                ilvl: data.bestWaistIlvl,
                id: data.bestWaistId,
                name: data.bestWaistName,
                quality: data.bestWaistQuality
            },
            legs: {
                ilvl: data.bestLegsIlvl,
                id: data.bestLegsId,
                name: data.bestLegsName,
                quality: data.bestLegsQuality
            },
            feet: {
                ilvl: data.bestFeetIlvl,
                id: data.bestFeetId,
                name: data.bestFeetName,
                quality: data.bestFeetQuality
            },
            finger1: {
                ilvl: data.bestFinger1Ilvl,
                id: data.bestFinger1Id,
                name: data.bestFinger1Name,
                quality: data.bestFinger1Quality
            },
            finger2: {
                ilvl: data.bestFinger2Ilvl,
                id: data.bestFinger2Id,
                name: data.bestFinger2Name,
                quality: data.bestFinger2Quality
            },
            trinket1: {
                ilvl: data.bestTrinket1Ilvl,
                id: data.bestTrinket1Id,
                name: data.bestTrinket1Name,
                quality: data.bestTrinket1Quality
            },
            trinket2: {
                ilvl: data.bestTrinket2Ilvl,
                id: data.bestTrinket2Id,
                name: data.bestTrinket2Name,
                quality: data.bestTrinket2Quality
            },
            mainHand: {
                ilvl: data.bestMainHandIlvl,
                id: data.bestMainHandId,
                name: data.bestMainHandName,
                quality: data.bestMainHandQuality
            },
            offHand: {
                ilvl: data.bestOffHandIlvl,
                id: data.bestOffHandId,
                name: data.bestOffHandName,
                quality: data.bestOffHandQuality
            }
        }
    })
)
