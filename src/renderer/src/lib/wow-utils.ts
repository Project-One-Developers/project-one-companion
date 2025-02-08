import type { WowItemSlot } from 'shared/types/types'

export function mapRaidbotSlotToWowSlot(raidbotSlot: string): WowItemSlot {
    switch (raidbotSlot) {
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
        case 'finger1':
            return 'Finger'
        case 'finger2':
            return 'Finger'
        case 'trinket':
            return 'Trinket'
        case 'trinket1':
            return 'Trinket'
        case 'trinket2':
            return 'Trinket'
        case 'main_hand':
            return 'Main Hand'
        case 'mainHand':
            return 'Main Hand'
        case 'off_hand':
            return 'Off Hand'
        case 'offHand':
            return 'Off Hand'
        default:
            throw new Error(`Unknown raidbot slot: ${raidbotSlot}`)
    }
}
