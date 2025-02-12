/// sources: https://www.raidbots.com/static/data/live/bonuses.json
// parse tww item tracks:
// jq 'map(select(.upgrade.fullName != null and (.upgrade.seasonId == 24 or .upgrade.seasonId == 25)) | {id, level: .upgrade.level, max: .upgrade.max, name: .upgrade.name, fullName: .upgrade.fullName, itemLevel: .upgrade.itemLevel})' bonus.json > parsed_bonus.json

import { ItemTrack, WowRaidDifficulty } from '@shared/types/types'
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

export function parseItemLevel(bonusIds: number[]): number | null {
    const itemTrack = parseItemTrack(bonusIds)
    if (itemTrack == null) {
        console.log('No item track infos in ' + bonusIds)
    }
    return itemTrack?.itemLevel ?? null
}

export function parseItemDiff(bonusIds: number[]): WowRaidDifficulty | null {
    const itemTrack = parseItemTrack(bonusIds)
    if (itemTrack == null) {
        console.log('No item track infos in ' + bonusIds)
    }
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

export function parseItemTrack(input: number[] | string): ItemTrack | null {
    loadBonusList()

    let bonusIds: number[]
    if (typeof input === 'string') {
        if (input.indexOf('/') > -1) bonusIds = input.split('/').map(Number)
        else bonusIds = input.split(':').map(Number)
    } else {
        bonusIds = input
    }

    for (const bonus of bonusIds) {
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

    console.log('No item track found for ' + input)
    return null // Return null if no match is found
}
