/// sources: https://www.raidbots.com/static/data/live/bonuses.json
// parse tww item tracks:
// jq 'map(select(.upgrade.fullName != null and (.upgrade.seasonId == 24 or .upgrade.seasonId == 25)) | {id, level: .upgrade.level, max: .upgrade.max, name: .upgrade.name, fullName: .upgrade.fullName, itemLevel: .upgrade.itemLevel})' bonus.json > parsed_bonus.json

import { Item, ItemTrack, WowRaidDifficulty } from '@shared/types/types'
import bonusItemTracks from './item-tracks'

export function parseItemDiff(bonusIds: number[]): WowRaidDifficulty | null {
    if (bonusIds.includes(10356)) {
        // bonus id for Mythic
        return 'Mythic'
    } else if (bonusIds.includes(10355)) {
        // bonus id for Heroic
        return 'Heroic'
    }
    // else if (bonusIds.includes(10353)){
    //     return 'Raid Finder'
    // }

    const itemTrack = parseItemTrack(bonusIds)
    switch (itemTrack?.name) {
        case 'Champion':
            return 'Normal'
        case 'Hero':
            return 'Heroic'
        case 'Myth':
            return 'Mythic'
        default:
            return null
    }
}

export function parseItemLevelFromTrack(
    item: Item,
    itemTrack: ItemTrack | null,
    bonusIds: number[]
): number | null {
    const diff = parseItemDiff(bonusIds)

    if (itemTrack == null && diff != null) {
        switch (diff) {
            case 'Normal':
                return item.ilvlNormal
            case 'Heroic':
                return item.ilvlHeroic
            case 'Mythic':
                return item.ilvlMythic
            default:
                return null
        }
    }

    if (itemTrack != null) {
        return itemTrack.itemLevel
    }

    // crafted items ilvl
    if (bonusIds.includes(11144)) {
        // tww season 1 rank 5
        return 636
    }

    // edge case items (not worth mapping all possible states with bonus id)
    if (item.id === 228411) {
        // tww season 1 -  Cyrce's Circlet (Siren Isles)
        return 658
    }

    return null
}

export function parseItemTrack(input: number[]): ItemTrack | null {
    for (const bonus of input) {
        if (bonus in bonusItemTracks) {
            return {
                level: bonusItemTracks[bonus].level,
                max: bonusItemTracks[bonus].max,
                name: bonusItemTracks[bonus].name,
                fullName: bonusItemTracks[bonus].fullName,
                itemLevel: bonusItemTracks[bonus].itemLevel
            }
        }
    }

    return null // Return null if no match is found
}

export const gearHasAvoidance = (input: number[] | null): boolean =>
    input ? input.includes(40) : false

export const gearHasLeech = (input: number[] | null): boolean =>
    input ? input.includes(41) : false

export const gearHasSpeed = (input: number[] | null): boolean =>
    input ? input.includes(42) : false

// 10397 Primastic Socket
// 11307 Socket on Crafted Gear
export const gearhasSocket = (input: number[] | null): boolean =>
    input ? [10397, 11307].some((value) => input.includes(value)) : false

export const gearTertiary = (input: number[] | null): boolean =>
    gearHasAvoidance(input) || gearHasLeech(input) || gearHasSpeed(input)

// gear manipolation
export function applySocket(input: number[]): void {
    input.push(10397)
}
export function applyAvoidance(input: number[]): void {
    input.push(40)
}
export function applyLeech(input: number[]): void {
    input.push(41)
}
export function applySpeed(input: number[]): void {
    input.push(42)
}
