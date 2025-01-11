import {
    wowArmorTypeSchema,
    wowClassSchema,
    wowItemSlotSchema,
    wowRaidDiffSchema,
    wowRoleClassSchema,
    wowRolesSchema
} from '../schemas/wow.schemas'

export const CLASSES = wowClassSchema.options

export const ROLES = wowRolesSchema.options

export const RAID_DIFF = wowRaidDiffSchema.options

export const ROLES_CLASSES_MAP = {
    Tank: wowRoleClassSchema.shape.Tank.options,
    Healer: wowRoleClassSchema.shape.Healer.options,
    DPS: wowRoleClassSchema.shape.DPS.options
}

export const ARMOR_TYPES = wowArmorTypeSchema.options
export const ITEM_SLOTS = wowItemSlotSchema.options
