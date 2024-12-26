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

// TODO: probably move in separate folders/files

export const droptimizerUpgradeSchema = z.object({
    dps: z.number(),
    itemId: z.number()
})

export const droptimizerSchema = z.object({
    id: z.string(),
    url: z.string().url(),
    resultRaw: z.string(),
    date: z.number(),
    raidDifficulty: z.string(),
    characterName: z.string(),
    fightInfo: z.object({
        fightstyle: z.string(),
        duration: z.number().min(1),
        nTargets: z.number().min(1)
    }),
    upgrades: z.array(droptimizerUpgradeSchema).nullable()
})

export const newDroptimizerSchema = droptimizerSchema.omit({ id: true, upgrades: true }).extend({
    upgrades: z.array(
        z.object({
            itemId: z.number(),
            dps: z.number()
        })
    )
})

export const characterSchema = z.object({
    id: z.string().uuid(),
    characterName: z.string(),
    class: wowClassSchema,
    role: wowRolesSchema,
    droptimizer: z.array(droptimizerSchema).optional()
})

export const playerSchema = z.object({
    id: z.string().uuid(),
    playerName: z.string(),
    characters: z.array(characterSchema).optional()
})

export const newCharacterSchema = characterSchema
    .omit({
        id: true,
        droptimizer: true
    })
    .merge(playerSchema.omit({ id: true, characters: true }))

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
    specs: z.string().nullish(),
    specIds: z.string().nullish(),
    classes: z.string().nullish(),
    classesId: z.string().nullish(),
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
