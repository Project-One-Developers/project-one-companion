import { z } from 'zod'

export const wowClassSchema = z.enum([
    'Death Knight',
    'Demon Hunter',
    'Druid',
    'Evoker',
    'Hunter',
    'Mage',
    'Monk',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior'
])

export const wowRolesSchema = z.enum(['Tank', 'Healer', 'DPS'])

export const wowRaidDiffSchema = z.enum(['Normal', 'Heroic', 'Mythic'])

export const itemSchema = z.object({
    id: z.number(),
    name: z.string(),
    ilvlMythic: z.number(),
    ilvlHeroic: z.number(),
    ilvlNormal: z.number(),
    bonusID: z.string().nullish(),
    itemClass: z.string(),
    slot: z.string().nullish(),
    itemSubclass: z.string().nullish(),
    tierPrefix: z.string().nullish(),
    tier: z.boolean().default(false),
    veryRare: z.boolean().default(false),
    catalyzed: z.boolean().default(false),
    boe: z.boolean().default(false),
    specs: z.string().array().nullish(),
    specIds: z.string().array().nullish(),
    classes: z.string().array().nullish(),
    classesId: z.string().array().nullish(),
    stats: z.string().nullish(),
    mainStats: z.string().nullish(),
    secondaryStats: z.string().nullish(),
    wowheadUrl: z.string().url(),
    iconName: z.string(),
    iconUrl: z.string().url(),
    bossName: z.string(), // ridondante ma utile
    bossId: z.number()
})

export const bossSchema = z.object({
    id: z.number(),
    name: z.string(),
    raid: z.string(),
    order: z.number()
})

export const itemToTiersetSchema = z.object({
    itemId: z.number(),
    tokenId: z.number()
})

export const itemToCatalystSchema = z.object({
    itemId: z.number(),
    encounterId: z.number(),
    catalyzedItemId: z.number()
})
