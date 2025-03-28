import { z } from 'zod'

export const wowClassNameSchema = z.enum([
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
    'Ranged',
    'Omni'
])

export const wowItemSlotKeySchema = z.enum([
    'head',
    'neck',
    'shoulder',
    'back',
    'chest',
    'wrist',
    'hands',
    'waist',
    'legs',
    'feet',
    'finger',
    'trinket',
    'main_hand',
    'off_hand',
    'omni'
])

export const wowItemEquippedSlotKeySchema = z.enum([
    'head',
    'neck',
    'shoulder',
    'back',
    'chest',
    'wrist',
    'hands',
    'waist',
    'legs',
    'feet',
    'finger1',
    'finger2',
    'trinket1',
    'trinket2',
    'main_hand',
    'off_hand'
])

export const wowItemSlotKeyTiersetSchema = z.enum(['head', 'shoulder', 'chest', 'hands', 'legs'])

export const wowArmorTypeSchema = z.enum(['Cloth', 'Leather', 'Mail', 'Plate'])

export const wowRolesSchema = z.enum(['Tank', 'Healer', 'DPS'])
export const wowRolePositionSchema = z.enum(['Melee', 'Ranged'])

export const wowRaidDiffSchema = z.enum(['LFR', 'Normal', 'Heroic', 'Mythic'])

export const wowItemTrackNameSchema = z.enum([
    'Explorer',
    'Adventurer',
    'Veteran',
    'Champion',
    'Hero',
    'Myth'
])

export const tierSetBonusSchema = z.enum(['none', '2p', '4p'])

export const wowItemTertiaryStatsSchema = z.enum(['Speed', 'Leech', 'Avoidance', 'Indestructible'])

export const wowRoleClassSchema = z.object({
    Tank: wowClassTankSchema,
    Healer: wowClassHealerSchema,
    DPS: wowClassNameSchema
})

export const wowSpecNameSchema = z.enum([
    // Death Knight
    'Blood',
    'Frost',
    'Unholy',
    // Demon Hunter
    'Havoc',
    'Vengeance',
    // Druid
    'Balance',
    'Feral',
    'Guardian',
    'Restoration',
    // Evoker
    'Devastation',
    'Preservation',
    'Augmentation',
    // Hunter
    'Beast Mastery',
    'Marksmanship',
    'Survival',
    // Mage
    'Arcane',
    'Fire',
    'Frost',
    // Monk
    'Brewmaster',
    'Mistweaver',
    'Windwalker',
    // Paladin
    'Holy',
    'Protection',
    'Retribution',
    // Priest
    'Discipline',
    'Holy',
    'Shadow',
    // Rogue
    'Assassination',
    'Outlaw',
    'Subtlety',
    // Shaman
    'Elemental',
    'Enhancement',
    'Restoration',
    // Warlock
    'Affliction',
    'Demonology',
    'Destruction',
    // Warrior
    'Arms',
    'Fury',
    'Protection'
])
