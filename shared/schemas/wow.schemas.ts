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

export const wowItemSlotSchema = z.enum([
    'Head',
    'Neck',
    'Shoulder',
    'Back',
    'Chest',
    'Wrist',
    'Hands',
    'Waist',
    'Legs',
    'Feet',
    'Finger',
    'Trinket',
    'Main Hand',
    'Off Hand',
    'Two Hand',
    'Ranged'
])

export const wowArmorTypeSchema = z.enum(['Cloth', 'Leather', 'Mail', 'Plate'])

export const wowRolesSchema = z.enum(['Tank', 'Healer', 'DPS'])

export const wowRaidDiffSchema = z.enum(['Heroic', 'Mythic'])

export const wowRoleClassSchema = z.object({
    Tank: wowClassTankSchema,
    Healer: wowClassHealerSchema,
    DPS: wowClassSchema
})
