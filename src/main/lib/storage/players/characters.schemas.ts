import { CharacterWowAudit, WowRaidDifficulty } from '@shared/types/types'
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
    averageItemLevel: z.string().nullable(),
    headIlvl: z.number().nullable(),
    headId: z.number().nullable(),
    neckIlvl: z.number().nullable(),
    neckId: z.number().nullable(),
    shoulderIlvl: z.number().nullable(),
    shoulderId: z.number().nullable(),
    backIlvl: z.number().nullable(),
    backId: z.number().nullable(),
    chestIlvl: z.number().nullable(),
    chestId: z.number().nullable(),
    wristIlvl: z.number().nullable(),
    wristId: z.number().nullable(),
    handsIlvl: z.number().nullable(),
    handsId: z.number().nullable(),
    waistIlvl: z.number().nullable(),
    waistId: z.number().nullable(),
    legsIlvl: z.number().nullable(),
    legsId: z.number().nullable(),
    feetIlvl: z.number().nullable(),
    feetId: z.number().nullable(),
    finger1Ilvl: z.number().nullable(),
    finger1Id: z.number().nullable(),
    finger2Ilvl: z.number().nullable(),
    finger2Id: z.number().nullable(),
    trinket1Ilvl: z.number().nullable(),
    trinket1Id: z.number().nullable(),
    trinket2Ilvl: z.number().nullable(),
    trinket2Id: z.number().nullable(),
    mainHandIlvl: z.number().nullable(),
    mainHandId: z.number().nullable(),
    offHandIlvl: z.number().nullable(),
    offHandId: z.number().nullable(),
    enchantQualityWrist: z.number().nullable(),
    enchantQualityLegs: z.number().nullable(),
    enchantQualityMainHand: z.number().nullable(),
    enchantQualityOffHand: z.number().nullable(),
    enchantQualityFinger1: z.number().nullable(),
    enchantQualityFinger2: z.number().nullable(),
    enchantQualityBack: z.number().nullable(),
    enchantQualityChest: z.number().nullable(),
    enchantQualityFeet: z.number().nullable(),
    enchantNameWrist: z.string().nullable(),
    enchantNameLegs: z.string().nullable(),
    enchantNameMainHand: z.string().nullable(),
    enchantNameOffHand: z.string().nullable(),
    enchantNameFinger1: z.string().nullable(),
    enchantNameFinger2: z.string().nullable(),
    enchantNameBack: z.string().nullable(),
    enchantNameChest: z.string().nullable(),
    enchantNameFeet: z.string().nullable(),
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
    bestNeckIlvl: z.number().nullable(),
    bestNeckId: z.number().nullable(),
    bestShoulderIlvl: z.number().nullable(),
    bestShoulderId: z.number().nullable(),
    bestBackIlvl: z.number().nullable(),
    bestBackId: z.number().nullable(),
    bestChestIlvl: z.number().nullable(),
    bestChestId: z.number().nullable(),
    bestWristIlvl: z.number().nullable(),
    bestWristId: z.number().nullable(),
    bestHandsIlvl: z.number().nullable(),
    bestHandsId: z.number().nullable(),
    bestWaistIlvl: z.number().nullable(),
    bestWaistId: z.number().nullable(),
    bestLegsIlvl: z.number().nullable(),
    bestLegsId: z.number().nullable(),
    bestFeetIlvl: z.number().nullable(),
    bestFeetId: z.number().nullable(),
    bestFinger1Ilvl: z.number().nullable(),
    bestFinger1Id: z.number().nullable(),
    bestFinger2Ilvl: z.number().nullable(),
    bestFinger2Id: z.number().nullable(),
    bestTrinket1Ilvl: z.number().nullable(),
    bestTrinket1Id: z.number().nullable(),
    bestTrinket2Ilvl: z.number().nullable(),
    bestTrinket2Id: z.number().nullable(),
    bestMainHandIlvl: z.number().nullable(),
    bestMainHandId: z.number().nullable(),
    bestOffHandIlvl: z.number().nullable(),
    bestOffHandId: z.number().nullable()
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
        averageIlvl: data.averageItemLevel,
        hightestIlvlEverEquipped: data.highestIlvlEverEquipped,
        enchant: {
            wrist: createEnchantPiece(data.enchantNameWrist, data.enchantQualityWrist),
            legs: createEnchantPiece(data.enchantNameLegs, data.enchantQualityLegs),
            mainHand: createEnchantPiece(data.enchantNameMainHand, data.enchantQualityMainHand),
            offHand: createEnchantPiece(data.enchantNameOffHand, data.enchantQualityOffHand),
            finger1: createEnchantPiece(data.enchantNameFinger1, data.enchantQualityFinger1),
            finger2: createEnchantPiece(data.enchantNameFinger2, data.enchantQualityFinger2),
            back: createEnchantPiece(data.enchantNameBack, data.enchantQualityBack),
            chest: createEnchantPiece(data.enchantNameChest, data.enchantQualityChest),
            feet: createEnchantPiece(data.enchantNameFeet, data.enchantQualityFeet)
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
            head: createTiersetPiece(data.tiersetHeadIlvl, data.tiersetHeadDiff),
            shoulder: createTiersetPiece(data.tiersetShouldersIlvl, data.tiersetShouldersDiff),
            chest: createTiersetPiece(data.tiersetChestIlvl, data.tiersetChestDiff),
            hands: createTiersetPiece(data.tiersetHandsIlvl, data.tiersetHandsDiff),
            legs: createTiersetPiece(data.tiersetLegsIlvl, data.tiersetLegsDiff)
        },
        equippedGear: {
            head: createGearPiece(data.headIlvl, data.headId),
            neck: createGearPiece(data.neckIlvl, data.neckId),
            shoulder: createGearPiece(data.shoulderIlvl, data.shoulderId),
            back: createGearPiece(data.backIlvl, data.backId),
            chest: createGearPiece(data.chestIlvl, data.chestId),
            wrist: createGearPiece(data.wristIlvl, data.wristId),
            hands: createGearPiece(data.handsIlvl, data.handsId),
            waist: createGearPiece(data.waistIlvl, data.waistId),
            legs: createGearPiece(data.legsIlvl, data.legsId),
            feet: createGearPiece(data.feetIlvl, data.feetId),
            finger1: createGearPiece(data.finger1Ilvl, data.finger1Id),
            finger2: createGearPiece(data.finger2Ilvl, data.finger2Id),
            trinket1: createGearPiece(data.trinket1Ilvl, data.trinket1Id),
            trinket2: createGearPiece(data.trinket2Ilvl, data.trinket2Id),
            mainHand: createGearPiece(data.mainHandIlvl, data.mainHandId),
            offHand: createGearPiece(data.offHandIlvl, data.offHandId)
        },
        bestGear: {
            head: createGearPiece(data.bestHeadIlvl, data.bestHeadId),
            neck: createGearPiece(data.bestNeckIlvl, data.bestNeckId),
            shoulder: createGearPiece(data.bestShoulderIlvl, data.bestShoulderId),
            back: createGearPiece(data.bestBackIlvl, data.bestBackId),
            chest: createGearPiece(data.bestChestIlvl, data.bestChestId),
            wrist: createGearPiece(data.bestWristIlvl, data.bestWristId),
            hands: createGearPiece(data.bestHandsIlvl, data.bestHandsId),
            waist: createGearPiece(data.bestWaistIlvl, data.bestWaistId),
            legs: createGearPiece(data.bestLegsIlvl, data.bestLegsId),
            feet: createGearPiece(data.bestFeetIlvl, data.bestFeetId),
            finger1: createGearPiece(data.bestFinger1Ilvl, data.bestFinger1Id),
            finger2: createGearPiece(data.bestFinger2Ilvl, data.bestFinger2Id),
            trinket1: createGearPiece(data.bestTrinket1Ilvl, data.bestTrinket1Id),
            trinket2: createGearPiece(data.bestTrinket2Ilvl, data.bestTrinket2Id),
            mainHand: createGearPiece(data.bestMainHandIlvl, data.bestMainHandId),
            offHand: createGearPiece(data.bestOffHandIlvl, data.bestOffHandId)
        }
    })
)

// Helper function to create a gear piece only if all properties are non-null
function createGearPiece(ilvl: number | null, id: number | null) {
    if (ilvl !== null && id !== null) {
        return {
            ilvl,
            id
        }
    }
    return null
}

function createTiersetPiece(ilvl: number | null, diff: string | null) {
    if (ilvl !== null && diff !== null) {
        return {
            ilvl,
            diff: wowAuditTiersetDiffToEnum(diff)
        }
    }
    return null
}

function createEnchantPiece(name: string | null, quality: number | null) {
    if (name !== null && quality !== null) {
        return {
            name,
            quality
        }
    }
    return null
}

function wowAuditTiersetDiffToEnum(diff: string): WowRaidDifficulty {
    if (diff === 'N') return 'Normal'
    if (diff === 'H') return 'Heroic'
    if (diff === 'M') return 'Mythic'

    console.log('Unable to map raid difficulty ' + diff)
    return 'Mythic'
}
