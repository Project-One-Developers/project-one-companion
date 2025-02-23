import { z } from 'zod'
import { gearItemSchema } from './items.schema'
import { droptimizerSchema } from './simulations.schemas'
import { wowClassNameSchema, wowRaidDiffSchema, wowRolesSchema } from './wow.schemas'

export const playerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1)
})

export const characterSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    realm: z.string().min(1),
    class: wowClassNameSchema,
    role: wowRolesSchema,
    main: z.boolean(),
    playerId: playerSchema.shape.id
})

export const characterWithPlayerSchema = characterSchema.extend({
    player: playerSchema
})

export const playerWithCharacterSchema = playerSchema.extend({
    characters: z.array(characterSchema)
})

export const newPlayerSchema = playerSchema.omit({
    id: true
})

export const editPlayerSchema = newPlayerSchema.extend({
    id: playerSchema.shape.id
})

export const playersListSchema = z.object({
    players: z.array(playerSchema)
})

export const newCharacterSchema = characterSchema.omit({
    id: true
})

export const editCharacterSchema = characterSchema.extend({
    id: characterSchema.shape.id
})

// wow audit

export const wowauditEnchantSchema = z.object({
    name: z.string(),
    quality: z.number()
})

export const wowauditGearItemSchema = z.object({
    ilvl: z.number(),
    id: z.number()
})

export const wowauditTiersetItemSchema = z.object({
    ilvl: z.number(),
    diff: wowRaidDiffSchema
})

export const charWowAuditSchema = z.object({
    name: z.string().max(24),
    realm: z.string(),
    race: z.string().nullable(),
    guildRank: z.string().nullable(),
    characterId: z.number(),
    blizzardLastModifiedUnixTs: z.number(),
    wowauditLastModifiedUnixTs: z.number(),
    weekMythicDungeons: z.number().nullable(),
    emptySockets: z.number().nullable(),
    averageIlvl: z.string().nullable(),
    hightestIlvlEverEquipped: z.string().nullable(),
    enchant: z.object({
        wrist: wowauditEnchantSchema.nullable(),
        legs: wowauditEnchantSchema.nullable(),
        main_hand: wowauditEnchantSchema.nullable(),
        off_hand: wowauditEnchantSchema.nullable(),
        finger1: wowauditEnchantSchema.nullable(),
        finger2: wowauditEnchantSchema.nullable(),
        back: wowauditEnchantSchema.nullable(),
        chest: wowauditEnchantSchema.nullable(),
        feet: wowauditEnchantSchema.nullable()
    }),
    greatVault: z.object({
        slot1: z.number().nullable(),
        slot2: z.number().nullable(),
        slot3: z.number().nullable(),
        slot4: z.number().nullable(),
        slot5: z.number().nullable(),
        slot6: z.number().nullable(),
        slot7: z.number().nullable(),
        slot8: z.number().nullable(),
        slot9: z.number().nullable()
    }),
    bestItemsEquipped: z.array(gearItemSchema),
    itemsEquipped: z.array(gearItemSchema),
    tiersetInfo: z.array(gearItemSchema)
})

export const characterGameInfoSchema = z.object({
    droptimizer: droptimizerSchema.nullable(),
    wowaudit: charWowAuditSchema.nullable()
})
