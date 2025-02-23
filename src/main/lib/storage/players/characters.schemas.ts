import { gearItemSchema } from '@shared/schemas/items.schema'
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
    averageItemLevel: z.string().nullable(),
    highestIlvlEverEquipped: z.string().nullable(),
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
    bestItemsEquipped: z.array(gearItemSchema),
    itemsEquipped: z.array(gearItemSchema),
    tiersetInfo: z.array(gearItemSchema)
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
            main_hand: createEnchantPiece(data.enchantNameMainHand, data.enchantQualityMainHand),
            off_hand: createEnchantPiece(data.enchantNameOffHand, data.enchantQualityOffHand),
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
        itemsEquipped: data.itemsEquipped,
        tiersetInfo: data.tiersetInfo,
        bestItemsEquipped: data.bestItemsEquipped
    })
)

function createEnchantPiece(name: string | null, quality: number | null) {
    if (name !== null && quality !== null) {
        return {
            name,
            quality
        }
    }
    return null
}
