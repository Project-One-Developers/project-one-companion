import {
    CharAssignmentHighlights,
    CharAssignmentInfo,
    Loot,
    LootAssignmentInfo,
    LootWithAssigned,
    LootWithItem,
    NewLootManual
} from '@shared/types/types'
import { getBisList } from '@storage/bis-list/bis-list.storage'
import { getDroptimizerLatestList } from '@storage/droptimizer/droptimizer.storage'
import {
    addLoots,
    assignLoot,
    getLootsByRaidSessionId,
    getLootsByRaidSessionIdWithAssigned,
    getLootsByRaidSessionIdWithItem,
    getLootWithItemById,
    unassignLoot
} from '@storage/loots/loots.storage'
import { getCharactersList } from '@storage/players/characters.storage'
import { getRaidSessionRoster } from '@storage/raid-session/raid-session.storage'
import {
    evalHighlightsAndScore,
    parseBestItemInSlot,
    parseDroptimizersInfo,
    parseLootBisForClass,
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

export const getLootsBySessionIdHandler = async (raidSessionId: string): Promise<Loot[]> =>
    await getLootsByRaidSessionId(raidSessionId)

export const getLootsBySessionIdWithItemHandler = async (
    raidSessionId: string
): Promise<LootWithItem[]> => await getLootsByRaidSessionIdWithItem(raidSessionId)

export const getLootsBySessionIdWithAssignedHandler = async (
    raidSessionId: string
): Promise<LootWithAssigned[]> => await getLootsByRaidSessionIdWithAssigned(raidSessionId)

export const assignLootHandler = async (
    charId: string,
    lootId: string,
    highlights: CharAssignmentHighlights
): Promise<void> => await assignLoot(charId, lootId, highlights)

export const unassignLootHandler = async (lootId: string): Promise<void> =>
    await unassignLoot(lootId)

/**
 * Retrieve all the information to evaluate the loot assignments
 * @param lootId Loot ID
 * @returns
 */
export const getLootAssignmentInfoHandler = async (lootId: string): Promise<LootAssignmentInfo> => {
    const [loot, roster, latestDroptimizer, bisList] = await Promise.all([
        getLootWithItemById(lootId),
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

    const maxGainFromDroptimizers = Math.max(
        ...latestDroptimizer.flatMap((item) => item.upgrades.map((upgrade) => upgrade.dps))
    )

    const charAssignmentInfo: CharAssignmentInfo[] = filteredRoster.map((char) => {
        // get latest droptimizers for a given chars
        const charDroptimizers = latestDroptimizer.filter(
            (dropt) => dropt.charInfo.name === char.name && dropt.charInfo.server === char.realm
        )
        const res: Omit<CharAssignmentInfo, 'highlights'> = {
            character: char,
            droptimizers: parseDroptimizersInfo(loot.item, loot.raidDifficulty, charDroptimizers),
            weeklyChest: parseWeeklyChest(charDroptimizers),
            tierset: parseTiersetInfo(charDroptimizers),
            bestItemInSlot: parseBestItemInSlot(loot.item.slotKey, charDroptimizers),
            bis: parseLootBisForClass(bisList, loot.item.id, char.class)
        }

        return {
            ...res,
            highlights: evalHighlightsAndScore(loot, res, maxGainFromDroptimizers)
        }
    })

    return {
        loot,
        eligible: charAssignmentInfo
    }
}
