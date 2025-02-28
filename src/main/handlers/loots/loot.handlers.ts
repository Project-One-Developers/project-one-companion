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
import { match } from 'ts-pattern'
import {
    evalHighlightsAndScore,
    parseBestItemInSlot,
    parseDroptimizersInfo,
    parseGreatVault,
    parseLootAlreadyGotIt,
    parseLootIsBisForChar,
    parseManualLoots,
    parseMrtLoots,
    parseRcLoots,
    parseTiersetInfo
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
    const [parsedData, elegibleCharacters] = await Promise.all([
        parseMrtLoots(csv, session.raidDate, session.raidDate + RAID_SESSION_UPPER_BOUND_DELTA),
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

    const maxGainFromAllDroptimizers = Math.max(
        ...latestDroptimizer.flatMap((item) => item.upgrades.map((upgrade) => upgrade.dps))
    )

    const charAssignmentInfo: CharAssignmentInfo[] = filteredRoster.map((char) => {
        // get latest droptimizers for a given chars
        const charDroptimizers = latestDroptimizer.filter(
            (dropt) => dropt.charInfo.name === char.name && dropt.charInfo.server === char.realm
        )

        // TODO: can't we directly query the last audit only when needed?
        const { charWowAudit, charLastUpdate } = match(charDroptimizers.length)
            .with(
                0,
                (): { charWowAudit: CharacterWowAudit | null; charLastUpdate: number | null } => {
                    const audit =
                        wowAuditData.find(
                            (wowaudit) =>
                                wowaudit.name === char.name && wowaudit.realm === char.realm
                        ) ?? null
                    return {
                        charWowAudit: audit,
                        charLastUpdate: audit?.wowauditLastModifiedUnixTs ?? null
                    }
                }
            )
            .otherwise(() => ({
                charWowAudit: null,
                charLastUpdate: Math.max(...charDroptimizers.map((c) => c.simInfo.date))
            }))

        // loot assigned to a given char
        const charAssignedLoots = allAssignedLoots.filter(
            (l) =>
                l.id !== loot.id && // we dont want to take in consideration this loot if already assigned to me
                l.assignedCharacterId === char.id &&
                (!charLastUpdate || l.dropDate > charLastUpdate) // we consider all the loots assigned from last known simc. we take all assignedif no char info
        )

        const res: Omit<CharAssignmentInfo, 'highlights'> = {
            character: char,
            droptimizers: parseDroptimizersInfo(loot.item, loot.raidDifficulty, charDroptimizers),
            weeklyChest: parseGreatVault(charDroptimizers),
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
            warnWowAudit: charWowAudit ? { type: 'used' } : { type: 'none' }
        }

        return {
            ...res,
            highlights: evalHighlightsAndScore(loot, res, maxGainFromAllDroptimizers)
        }
    })

    return {
        loot,
        eligible: charAssignmentInfo
    }
}
