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

export const wowClassTankSchema = z.enum([
    'Death Knight',
    'Paladin',
    'Warrior',
    'Druid',
    'Monk',
    'Demon Hunter'
])

export const wowClassHealerSchema = z.enum([
    'Paladin',
    'Shaman',
    'Druid',
    'Priest',
    'Monk',
    'Evoker'
])

export const wowRolesSchema = z.enum(['Tank', 'Healer', 'DPS'])

export const wowRaidDiffSchema = z.enum(['Normal', 'Heroic', 'Mythic'])

export const wowRoleClassSchema = z.object({
    Tank: wowClassTankSchema,
    Healer: wowClassHealerSchema,
    DPS: wowClassSchema
})

export const itemSchema = z.object({
    id: z.number(),
    name: z.string(),
    ilvlMythic: z.number().nullish(),
    ilvlHeroic: z.number().nullish(),
    ilvlNormal: z.number().nullish(),
    bonusID: z.string().nullish(),
    itemClass: z.string().nullish(),
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
    wowheadUrl: z.string().url().nullish(),
    iconName: z.string().nullish(),
    iconUrl: z.string().url().nullish(),
    bossName: z.string().nullish(), // ridondante ma utile
    bossId: z.number()
})

export const bossSchema = z.object({
    id: z.number(),
    name: z.string(),
    raidName: z.string().nullish(),
    raidId: z.number().nullish(),
    order: z.number(),
    items: z.array(itemSchema)
})

export const itemToTiersetSchema = z.object({
    itemId: z.number(),
    tokenId: z.number()
})
export const itemToTiersetArraySchema = z.array(itemToTiersetSchema)

export const itemToCatalystSchema = z.object({
    raidItemId: z.number(),
    encounterId: z.number(),
    catalyzedItemId: z.number()
})
export const itemToCatalystArraySchema = z.array(itemToCatalystSchema)
