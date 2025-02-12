import { wowItemSlotKeySchema } from '@shared/schemas/wow.schemas'
import { WowItemEquippedSlotKey, WowItemSlotKey } from '@shared/types/types'

export const equippedSlotToSlot = (equipped: WowItemEquippedSlotKey): WowItemSlotKey => {
    return wowItemSlotKeySchema.parse(equipped.replaceAll('1', '').replaceAll('2', ''))
}

export function formatWowSlotKey(slot: WowItemSlotKey): string {
    switch (slot) {
        case 'head':
            return 'Head'
        case 'neck':
            return 'Neck'
        case 'shoulder':
            return 'Shoulder'
        case 'back':
            return 'Back'
        case 'chest':
            return 'Chest'
        case 'wrist':
            return 'Wrist'
        case 'hands':
            return 'Hands'
        case 'waist':
            return 'Waist'
        case 'legs':
            return 'Legs'
        case 'feet':
            return 'Feet'
        case 'finger':
            return 'Finger'
        case 'trinket':
            return 'Trinket'
        case 'main_hand':
            return 'Main Hand'
        case 'off_hand':
            return 'Off Hand'
        case 'omni':
            return 'Omni'
        default:
            throw new Error(`Unknown slot: ${slot}`)
    }
}

export function formatWowEquippedSlotKey(slot: WowItemEquippedSlotKey): string {
    switch (slot) {
        case 'finger1':
            return 'Finger'
        case 'finger2':
            return 'Finger'
        case 'trinket1':
            return 'Trinket'
        case 'trinket2':
            return 'Trinket'
        default:
            return formatWowSlotKey(slot)
    }
}
