import {
    CharacterWowAudit,
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
import { getAllCharacterWowAudit, getCharactersList } from '@storage/players/characters.storage'
import { getRaidSession, getRaidSessionRoster } from '@storage/raid-session/raid-session.storage'
import {
    evalHighlightsAndScore,
    parseBestItemInSlot,
    parseDroptimizersInfo,
    parseLootAlreadyGotIt,
    parseLootIsBisForChar,
    parseManualLoots,
    parseMrtLoots,
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
        parseRcLoots(csv, session.raidDate, session.raidDate + 5 * 60 * 60), // lower bound = raid session date - upperbound = raid session + 5hours
        getRaidSessionRoster(raidSessionId)
    ])
    await addLoots(raidSessionId, parsedData, elegibleCharacters)
}

export const addRaidLootsByMrtHandler = async (
    raidSessionId: string,
    csv: string
): Promise<void> => {
    const session = await getRaidSession(raidSessionId)
    const [parsedData, elegibleCharacters] = await Promise.all([
        parseMrtLoots(csv, session.raidDate, session.raidDate + 5 * 60 * 60), // lower bound = raid session date - upperbound = raid session + 5hours
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
    const [loot, roster, latestDroptimizer, bisList, allAssignedLoots, wowAuditData] =
        await Promise.all([
            getLootWithItemById(lootId),
            getCharactersList(),
            getDroptimizerLatestList(),
            getBisList(),
            getLootAssigned(),
            getAllCharacterWowAudit()
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

        let charWowAudit: CharacterWowAudit | null = null
        let charLastUpdate: number | null = Math.max(...charDroptimizers.map((c) => c.simInfo.date))

        // wow audit data when no char droptimizer
        // healer will always enter this branch
        if (charDroptimizers.length === 0 && wowAuditData) {
            charWowAudit =
                wowAuditData.find(
                    (wowaudit) => wowaudit.name === char.name && wowaudit.realm === char.realm
                ) ?? null
            charLastUpdate = charWowAudit?.wowauditLastModifiedUnixTs ?? null
        }

        // loot assgined to a given char
        const charAssignedLoots = allAssignedLoots.filter(
            (l) =>
                l.id !== loot.id && // we dont want to take in consideration this loot if already assigned to me
                l.assignedCharacterId === char.id &&
                (!charLastUpdate || l.dropDate > charLastUpdate) // we consider all the loots assigned from last known simc. we take all assignedif no char info
        )

        const res: Omit<CharAssignmentInfo, 'highlights'> = {
            character: char,
            droptimizers: parseDroptimizersInfo(loot.item, loot.raidDifficulty, charDroptimizers),
            weeklyChest: parseWeeklyChest(charDroptimizers),
            tierset: parseTiersetInfo(charDroptimizers, charAssignedLoots, charWowAudit),
            bestItemsInSlot: parseBestItemInSlot(
                loot.item.slotKey,
                charDroptimizers,
                charAssignedLoots,
                charWowAudit
            ),
            alreadyGotIt: parseLootAlreadyGotIt(
                loot,
                charDroptimizers,
                charAssignedLoots,
                charWowAudit
            ),
            bis: parseLootIsBisForChar(bisList, loot.item.id, char),
            warnDroptimizer:
                charDroptimizers.length === 0 ? { type: 'not-imported' } : { type: 'none' },
            warnWowAudit: wowAuditData ? { type: 'used' } : { type: 'none' }
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
