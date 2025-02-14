/// sources: https://www.raidbots.com/static/data/live/bonuses.json
// parse tww item tracks:
// jq 'map(select(.upgrade.fullName != null and (.upgrade.seasonId == 24 or .upgrade.seasonId == 25)) | {id, level: .upgrade.level, max: .upgrade.max, name: .upgrade.name, fullName: .upgrade.fullName, itemLevel: .upgrade.itemLevel})' bonus.json > parsed_bonus.json

import { Item, ItemTrack, WowRaidDifficulty } from '@shared/types/types'
import { readFileSync } from 'fs'
import path from 'path'

let bonusList: Record<number, any> | null = null

function loadBonusList(): void {
    if (!bonusList) {
        bonusList = JSON.parse(
            readFileSync(
                path.join(__dirname, `../../resources/wow/bonus-item-tracks.json`),
                'utf-8'
            )
        )
    }
}

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

    // edge items (not worth mapping all possible states with bonus id)
    if (item.id === 228411) {
        // tww season 1 -  Cyrce's Circlet (Siren Isles)
        return 658
    }

    return null
}

export function parseItemTrack(input: number[]): ItemTrack | null {
    loadBonusList()

    for (const bonus of input) {
        if (bonusList && bonus in bonusList) {
            return {
                level: bonusList[bonus].level,
                max: bonusList[bonus].max,
                name: bonusList[bonus].name,
                fullName: bonusList[bonus].fullName,
                itemLevel: bonusList[bonus].itemLevel
            }
        }
    }

    return null // Return null if no match is found
}
