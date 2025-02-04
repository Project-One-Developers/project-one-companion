import { z } from 'zod'
import { droptimizerSchema } from './simulations.schemas'
import { wowClassSchema, wowRolesSchema } from './wow.schemas'

export const playerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1)
})

export const characterSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    realm: z.string().min(1),
    class: wowClassSchema,
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

export const charactersListSchema = z.array(characterSchema)

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

export const wowauditGearItemSchema = z.object({
    ilvl: z.number(),
    id: z.number()
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
        wrist: z.number().nullable(),
        legs: z.number().nullable(),
        mainHand: z.number().nullable(),
        offHand: z.number().nullable(),
        finger1: z.number().nullable(),
        finger2: z.number().nullable(),
        back: z.number().nullable(),
        chest: z.number().nullable(),
        feet: z.number().nullable()
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
    tierset: z.object({
        headIlvl: z.number().nullable(),
        shouldersIlvl: z.number().nullable(),
        chestIlvl: z.number().nullable(),
        handsIlvl: z.number().nullable(),
        legsIlvl: z.number().nullable(),
        headDiff: z.string().nullable(),
        shouldersDiff: z.string().nullable(),
        chestDiff: z.string().nullable(),
        handsDiff: z.string().nullable(),
        legsDiff: z.string().nullable()
    }),
    equippedGear: z.object({
        head: wowauditGearItemSchema.nullish(),
        neck: wowauditGearItemSchema.nullish(),
        shoulder: wowauditGearItemSchema.nullish(),
        back: wowauditGearItemSchema.nullish(),
        chest: wowauditGearItemSchema.nullish(),
        wrist: wowauditGearItemSchema.nullish(),
        hands: wowauditGearItemSchema.nullish(),
        waist: wowauditGearItemSchema.nullish(),
        legs: wowauditGearItemSchema.nullish(),
        feet: wowauditGearItemSchema.nullish(),
        finger1: wowauditGearItemSchema.nullish(),
        finger2: wowauditGearItemSchema.nullish(),
        trinket1: wowauditGearItemSchema.nullish(),
        trinket2: wowauditGearItemSchema.nullish(),
        mainHand: wowauditGearItemSchema.nullish(),
        offHand: wowauditGearItemSchema.nullish()
    }),
    bestGear: z.object({
        head: wowauditGearItemSchema.nullish(),
        neck: wowauditGearItemSchema.nullish(),
        shoulder: wowauditGearItemSchema.nullish(),
        back: wowauditGearItemSchema.nullish(),
        chest: wowauditGearItemSchema.nullish(),
        wrist: wowauditGearItemSchema.nullish(),
        hands: wowauditGearItemSchema.nullish(),
        waist: wowauditGearItemSchema.nullish(),
        legs: wowauditGearItemSchema.nullish(),
        feet: wowauditGearItemSchema.nullish(),
        finger1: wowauditGearItemSchema.nullish(),
        finger2: wowauditGearItemSchema.nullish(),
        trinket1: wowauditGearItemSchema.nullish(),
        trinket2: wowauditGearItemSchema.nullish(),
        mainHand: wowauditGearItemSchema.nullish(),
        offHand: wowauditGearItemSchema.nullish()
    })
})

export const characterGameInfoSchema = z.object({
    droptimizer: droptimizerSchema.nullable(),
    wowaudit: charWowAuditSchema.nullable()
})
