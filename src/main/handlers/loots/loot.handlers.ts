import {
    CharAssignmentInfo,
    LootAssignmentInfo,
    LootWithItem,
    NewLootsFromManualInput,
    NewLootsFromRc,
    TiersetInfo
} from '@shared/types/types'
import { getBisList } from '@storage/bis-list/bis-list.storage'
import { getDroptimizerLatestList } from '@storage/droptimizer/droptimizer.storage'
import {
    addLoots,
    assignLoot,
    getLootById,
    getLootsByRaidSessionId,
    getLootsByRaidSessionIdWithAssigned,
    unassignLoot
} from '@storage/loots/loots.storage'
import { getCharactersList } from '@storage/players/characters.storage'
import { getRaidSessionRoster } from '@storage/raid-session/raid-session.storage'
import { parseRaidSessionCsv } from './loot.utils'

export const addRaidLootsByRCLootCsvHandler = async (loot: NewLootsFromRc): Promise<void> => {
    const parsedData = await parseRaidSessionCsv(loot.csv)
    const elegibleCharacters = await getRaidSessionRoster(loot.raidSessionId)

    await addLoots(loot.raidSessionId, parsedData, elegibleCharacters)
}

export const addRaidLootsByManualInputHandler = async (
    loot: NewLootsFromManualInput
): Promise<void> => {
    //const parsedData = await parseRaidSessionCsv(loot.raidSessionId, loot.csv)
    console.log(loot)

    // TODO: insertion
}

export const getLootsBySessionIdHandler = async (
    raidSessionId: string
): Promise<LootWithItem[]> => {
    const res = await getLootsByRaidSessionId(raidSessionId)
    return res
}

export const getLootsBySessionIdWithAssignedHandler = async (
    raidSessionId: string
): Promise<LootWithItem[]> => {
    const res = await getLootsByRaidSessionIdWithAssigned(raidSessionId)
    return res
}

export const assignLootHandler = async (
    charId: string,
    lootId: string,
    score?: number
): Promise<void> => {
    await assignLoot(charId, lootId, score)
}

export const unassignLootHandler = async (lootId: string): Promise<void> => {
    await unassignLoot(lootId)
}

const parseTiersetInfo = (tiersetInfo: TiersetInfo[]): TiersetInfo[] => {
    const maxItemLevelBySlot = new Map<string, TiersetInfo>()

    tiersetInfo.forEach((item) => {
        if (item.slot) {
            const existingItem = maxItemLevelBySlot.get(item.slot)

            let itemLevel = -1
            if (item.itemLevel == null) {
                itemLevel = 1 // todo: parse from bonusString
            } else {
                itemLevel = item.itemLevel
            }

            if (
                !existingItem ||
                (item.itemLevel &&
                    (existingItem.itemLevel == null || itemLevel > existingItem.itemLevel))
            ) {
                maxItemLevelBySlot.set(item.slot, { ...item, itemLevel })
            }
        }
    })

    return [
        ...Array.from(maxItemLevelBySlot.values()),
        ...tiersetInfo.filter((t) => t.slot === null)
    ]
}

/**
 * Retrieve all the information to evaluate the loot assignments
 * @param lootId Loot ID
 * @returns
 */
export const getLootAssignmentInfoHandler = async (lootId: string): Promise<LootAssignmentInfo> => {
    console.log('getLootAssignmentInfoHandler')

    const [loot, roster, latestDroptimizer, bisList] = await Promise.all([
        getLootById(lootId),
        getCharactersList(),
        getDroptimizerLatestList(),
        //getCharacterWowAuditList(),
        getBisList()
    ])

    const filteredRoster = roster.filter(
        (character) =>
            loot.charsEligibility.includes(character.id) &&
            (loot.item.classes == null || loot.item.classes.includes(character.class))
    )

    const charAssignmentInfo: CharAssignmentInfo[] = filteredRoster.map((char) => {
        const charDroptimizers = latestDroptimizer.filter(
            (dropt) =>
                dropt.raidInfo.difficulty == loot.raidDifficulty &&
                dropt.charInfo.name === char.name &&
                dropt.charInfo.server === char.realm
        )

        const droptWithWeeklyChest = charDroptimizers
            .filter((c) => c.weeklyChest)
            .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]

        const droptWithTiersetInfo = charDroptimizers
            .filter((c) => c.tiersetInfo != null && c.tiersetInfo.length > 0)
            .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]

        const isBis = bisList.some((bis) => {
            return bis.itemIds.includes(loot.item.id) && bis.wowClass === char.class
        })

        return {
            character: char,
            droptimizers: charDroptimizers,
            weeklyChest: droptWithWeeklyChest?.weeklyChest ?? [],
            tierset: parseTiersetInfo(droptWithTiersetInfo?.tiersetInfo ?? []),
            bis: isBis,
            score: Math.floor(Math.random() * (10000 - 10 + 1)) + 10
        }
    })

    return {
        loot,
        eligible: charAssignmentInfo
    }
}
