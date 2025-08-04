import { raiderIoProgressSchema } from '@shared/schemas/raiderio.schemas'
import z from 'zod'

const gemDetailSchema = z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string()
})

const enchantDetailSchema = z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string()
})

const itemSchema = z.object({
    item_id: z.number(),
    item_level: z.number(),
    enchant: z.number().optional(),
    icon: z.string(),
    name: z.string(),
    item_quality: z.number(),
    is_legendary: z.boolean(),
    is_azerite_armor: z.boolean(),
    tier: z.string().optional(),
    gems: z.array(z.number()),
    gems_detail: z.array(gemDetailSchema),
    enchants: z.array(z.number()),
    enchants_detail: z.array(enchantDetailSchema),
    bonuses: z.array(z.number())
})

const itemsSchema = z.object({
    head: itemSchema.optional(),
    neck: itemSchema.optional(),
    shoulder: itemSchema.optional(),
    back: itemSchema.optional(),
    chest: itemSchema.optional(),
    waist: itemSchema.optional(),
    wrist: itemSchema.optional(),
    hands: itemSchema.optional(),
    legs: itemSchema.optional(),
    feet: itemSchema.optional(),
    finger1: itemSchema.optional(),
    finger2: itemSchema.optional(),
    trinket1: itemSchema.optional(),
    trinket2: itemSchema.optional(),
    mainhand: itemSchema.optional(),
    offhand: itemSchema.optional()
})

const itemDetailsSchema = z.object({
    created_at: z.string(), // ISO date string
    updated_at: z.string(), // ISO date string
    item_level_equipped: z.coerce.string(),
    items: itemsSchema
})

const characterInfoRaiderioSchema = z.object({
    id: z.number(),
    race: z.object({
        id: z.number(),
        name: z.string()
    })
})

const characterDetailsSchema = z.object({
    character: characterInfoRaiderioSchema,
    itemDetails: itemDetailsSchema,
    meta: z.object({
        loggedOutAt: z.string() // ISO date string
    })
})

export const raiderioResponseSchema = z.object({
    characterRaidProgress: raiderIoProgressSchema,
    characterDetails: characterDetailsSchema
})

// types
export type RaiderioResponse = z.infer<typeof raiderioResponseSchema>
export type RaiderioItems = z.infer<typeof itemsSchema>
