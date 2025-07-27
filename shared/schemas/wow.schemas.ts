import {
    ARMOR_TYPES,
    CLASSES_NAME,
    ITEM_SLOTS_DESC,
    ITEM_SLOTS_KEY,
    RAID_DIFF,
    ROLES,
    SPECS_NAME,
    TERTIARY_STATS
} from '@shared/consts/wow.consts'
import { z } from 'zod'

export const wowClassNameSchema = z.enum(CLASSES_NAME)

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

export const wowItemSlotSchema = z.enum(ITEM_SLOTS_DESC)

export const wowItemSlotKeySchema = z.enum(ITEM_SLOTS_KEY)

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

export const wowArmorTypeSchema = z.enum(ARMOR_TYPES)

export const wowRolesSchema = z.enum(ROLES)
export const wowRolePositionSchema = z.enum(['Melee', 'Ranged'])

export const wowRaidDiffSchema = z.enum(RAID_DIFF)

export const wowItemTrackNameSchema = z.enum([
    'Explorer',
    'Adventurer',
    'Veteran',
    'Champion',
    'Hero',
    'Myth'
])

export const tierSetBonusSchema = z.enum(['none', '2p', '4p'])

export const wowItemTertiaryStatsSchema = z.enum(TERTIARY_STATS)

export const wowRoleClassSchema = z.object({
    Tank: wowClassTankSchema,
    Healer: wowClassHealerSchema,
    DPS: wowClassNameSchema
})

export const wowSpecNameSchema = z.enum(SPECS_NAME)
