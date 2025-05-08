import { getWowClassFromIdOrName } from '@shared/libs/spec-parser/spec-utils'
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
    tradeLoot,
    unassignLoot,
    untradeLoot
} from '@storage/loots/loots.storage'
import { getAllCharacterWowAudit, getCharactersList } from '@storage/players/characters.storage'
import { getRaidSession, getRaidSessionRoster } from '@storage/raid-session/raid-session.storage'
import {
    evalHighlightsAndScore,
    getLatestSyncDate,
    parseBestItemInSlot,
    parseDroptimizersInfo,
    parseDroptimizerWarn,
    parseGreatVault,
    parseLootAlreadyGotIt,
    parseLootBisSpecForChar,
    parseManualLoots,
    parseMrtLoots,
    parseRcLoots,
    parseTiersetInfo,
    parseWowAuditWarn
} from './loot.utils'

const ONE_HOUR_IN_SECONDS = 60 * 60
const RAID_SESSION_UPPER_BOUND_DELTA = 5 * ONE_HOUR_IN_SECONDS

export const addRaidLootsByRCLootCsvHandler = async (
    raidSessionId: string,
    csv: string
): Promise<void> => {
    const session = await getRaidSession(raidSessionId)
    const [parsedData, elegibleCharacters] = await Promise.all([
        parseRcLoots(csv, session.raidDate, session.raidDate + RAID_SESSION_UPPER_BOUND_DELTA),
        getRaidSessionRoster(raidSessionId)
    ])
    await addLoots(raidSessionId, parsedData, elegibleCharacters)
}

export const addRaidLootsByMrtHandler = async (
    raidSessionId: string,
    csv: string
): Promise<void> => {
    const session = await getRaidSession(raidSessionId)
    const lowerBound = session.raidDate
    const upperBound = session.raidDate + RAID_SESSION_UPPER_BOUND_DELTA
    console.log('addRaidLootsByMrtHandler: ', lowerBound, upperBound)
    const [parsedData, elegibleCharacters] = await Promise.all([
        parseMrtLoots(csv, lowerBound, upperBound),
        getRaidSessionRoster(raidSessionId)
    ])
    if (parsedData.length > 0) {
        await addLoots(raidSessionId, parsedData, elegibleCharacters)
    }
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

export const getLootsBySessionIdHandler = async (raidSessionId: string): Promise<Loot[]> => {
    return await getLootsByRaidSessionId(raidSessionId)
}

export const getLootsBySessionIdWithItemHandler = async (
    raidSessionId: string
): Promise<LootWithItem[]> => {
    return await getLootsByRaidSessionIdWithItem(raidSessionId)
}

export const getLootsBySessionIdWithAssignedHandler = async (
    raidSessionId: string
): Promise<LootWithAssigned[]> => {
    return await getLootsByRaidSessionIdWithAssigned(raidSessionId)
}

export const assignLootHandler = async (
    charId: string,
    lootId: string,
    highlights: CharAssignmentHighlights
): Promise<void> => {
    await assignLoot(charId, lootId, highlights)
}

export const unassignLootHandler = async (lootId: string): Promise<void> => {
    await unassignLoot(lootId)
}

export const tradeLootHandler = async (lootId: string): Promise<void> => {
    await tradeLoot(lootId)
}

export const untradeLootHandler = async (lootId: string): Promise<void> => {
    await untradeLoot(lootId)
}

export const deleteLootHandler = async (lootId: string): Promise<void> => {
    await deleteLoot(lootId)
}

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
        character =>
            loot.charsEligibility.includes(character.id) &&
            (loot.item.classes == null || loot.item.classes.includes(character.class))
    )

    const maxGainFromAllDroptimizers = Math.max(
        ...latestDroptimizer.flatMap(item => item.upgrades.map(upgrade => upgrade.dps))
    )

    const charAssignmentInfo: CharAssignmentInfo[] = await Promise.all(
        filteredRoster.map(async char => {
            // get latest droptimizers for a given chars
            const charDroptimizers = latestDroptimizer.filter(
                dropt => dropt.charInfo.name === char.name && dropt.charInfo.server === char.realm
            )

            const charWowAudit: CharacterWowAudit | null =
                wowAuditData.find(
                    wowaudit => wowaudit.name === char.name && wowaudit.realm === char.realm
                ) ?? null

            // we consider all the loots assigned from last known simc / wow audit sync. we take all assignedif no char info
            const lowerBound = getLatestSyncDate(charDroptimizers, charWowAudit)

            // loot assigned to a given char
            const charAssignedLoots = !lowerBound
                ? []
                : allAssignedLoots.filter(
                      l =>
                          l.id !== loot.id && // we dont want to take in consideration this loot if already assigned to me
                          l.assignedCharacterId === char.id &&
                          l.dropDate > lowerBound
                  )

            const res: Omit<CharAssignmentInfo, 'highlights'> = {
                character: char,
                droptimizers: parseDroptimizersInfo(
                    loot.item,
                    loot.raidDifficulty,
                    charDroptimizers
                ),
                weeklyChest: parseGreatVault(charDroptimizers),
                tierset: parseTiersetInfo(charDroptimizers, charAssignedLoots, charWowAudit),
                bestItemsInSlot: parseBestItemInSlot(
                    loot.item.slotKey,
                    charDroptimizers,
                    charAssignedLoots,
                    charWowAudit
                ),
                alreadyGotIt: await parseLootAlreadyGotIt(
                    loot,
                    getWowClassFromIdOrName(char.class),
                    charDroptimizers,
                    charAssignedLoots,
                    charWowAudit
                ),
                bisForSpec: parseLootBisSpecForChar(bisList, loot.item.id, char),
                warnDroptimizer: parseDroptimizerWarn(charDroptimizers, charAssignedLoots),
                warnWowAudit: parseWowAuditWarn(charWowAudit)
            }

            return {
                ...res,
                highlights: evalHighlightsAndScore(loot, res, maxGainFromAllDroptimizers)
            }
        })
    )

    return {
        loot,
        eligible: charAssignmentInfo
    }
}
