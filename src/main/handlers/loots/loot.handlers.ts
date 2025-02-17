import {
    CharAssignmentInfo,
    LootAssignmentInfo,
    LootWithItem,
    NewLootManual
} from '@shared/types/types'
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
import {
    parseBestItemInSlot,
    parseDroptimizersInfo,
    parseManualLoots,
    parseRcLoots,
    parseTiersetInfo,
    parseWeeklyChest
} from './loot.utils'

export const addRaidLootsByRCLootCsvHandler = async (
    raidSessionId: string,
    csv: string
): Promise<void> => {
    const parsedData = await parseRcLoots(csv)
    const elegibleCharacters = await getRaidSessionRoster(raidSessionId)
    await addLoots(raidSessionId, parsedData, elegibleCharacters)
}

export const addRaidLootsByManualInputHandler = async (
    raidSessionId: string,
    loots: NewLootManual[]
): Promise<void> => {
    const parsedData = await parseManualLoots(loots)
    const elegibleCharacters = await getRaidSessionRoster(raidSessionId)
    await addLoots(raidSessionId, parsedData, elegibleCharacters)
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

/**
 * Retrieve all the information to evaluate the loot assignments
 * @param lootId Loot ID
 * @returns
 */
export const getLootAssignmentInfoHandler = async (lootId: string): Promise<LootAssignmentInfo> => {
    console.log('getLootAssignmentInfoHandler')

    const [loot, roster, latestDroptimizer] = await Promise.all([
        getLootById(lootId),
        getCharactersList(),
        getDroptimizerLatestList()
        //getCharacterWowAuditList(),
        //getBisList()
    ])

    const filteredRoster = roster.filter(
        (character) =>
            loot.charsEligibility.includes(character.id) &&
            (loot.item.classes == null || loot.item.classes.includes(character.class))
    )

    const charAssignmentInfo: CharAssignmentInfo[] = filteredRoster.map((char) => {
        // get latest droptimizers for a given chars
        const charDroptimizers = latestDroptimizer.filter(
            (dropt) => dropt.charInfo.name === char.name && dropt.charInfo.server === char.realm
        )
        return {
            character: char,
            droptimizers: parseDroptimizersInfo(loot.item, loot.raidDifficulty, charDroptimizers),
            weeklyChest: parseWeeklyChest(charDroptimizers),
            tierset: parseTiersetInfo(charDroptimizers),
            bestItemInSlot: parseBestItemInSlot(loot.item.slotKey, charDroptimizers),
            bis: false,
            //bis: parseLootIsBis(bisList, loot, char),
            score: Math.floor(Math.random() * (10000 - 10 + 1)) + 10
        }
    })

    return {
        loot,
        eligible: charAssignmentInfo
    }
}
