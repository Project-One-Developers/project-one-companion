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
    deleteLoot,
    getLootAssigned,
    getLootsByRaidSessionId,
    getLootsByRaidSessionIdWithAssigned,
    getLootsByRaidSessionIdWithItem,
    getLootWithItemById,
    unassignLoot
} from '@storage/loots/loots.storage'
import { getCharactersList } from '@storage/players/characters.storage'
import { getRaidSession, getRaidSessionRoster } from '@storage/raid-session/raid-session.storage'
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
    const session = await getRaidSession(raidSessionId)
    const [parsedData, elegibleCharacters] = await Promise.all([
        parseRcLoots(csv, session.raidDate),
        getRaidSessionRoster(raidSessionId)
    ])
    await addLoots(raidSessionId, parsedData, elegibleCharacters)
}

export const addRaidLootsByManualInputHandler = async (
    raidSessionId: string,
    loots: NewLootManual[]
): Promise<void> => {
    const [parsedData, elegibleCharacters] = await Promise.all([
        parseManualLoots(loots),
        getRaidSessionRoster(raidSessionId)
    ])
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

export const deleteLootHandler = async (lootId: string): Promise<void> => await deleteLoot(lootId)

/**
 * Retrieve all the information to evaluate the loot assignments
 * @param lootId Loot ID
 * @returns
 */
export const getLootAssignmentInfoHandler = async (lootId: string): Promise<LootAssignmentInfo> => {
    // todo: almost any query can be cached until wowaudit/droptimizer insert/reload
    const [loot, roster, latestDroptimizer, bisList, allAssignedLoots] = await Promise.all([
        getLootWithItemById(lootId),
        getCharactersList(),
        getDroptimizerLatestList(),
        getBisList(),
        getLootAssigned()
        // getAllCharacterWowAudit(),
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
        // wow audit data for a given char
        // const charWowAudit = wowAuditData.find(
        //     (wowaudit) => wowaudit.name === char.name && wowaudit.realm === char.realm
        // )
        // loot assgined to a given char
        const lootsAssignedToChar = allAssignedLoots.filter(
            (l) =>
                l.assignedCharacterId === char.id &&
                l.dropDate > Math.max(...charDroptimizers.map((c) => c.simInfo.date)) // we consider all the loots assigned from last known simc
        )
        const res: Omit<CharAssignmentInfo, 'highlights'> = {
            character: char,
            droptimizers: parseDroptimizersInfo(loot.item, loot.raidDifficulty, charDroptimizers),
            weeklyChest: parseWeeklyChest(charDroptimizers),
            tierset: parseTiersetInfo(charDroptimizers, lootsAssignedToChar),
            bestItemsInSlot: parseBestItemInSlot(
                loot.item.slotKey,
                charDroptimizers,
                lootsAssignedToChar
            ),
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
