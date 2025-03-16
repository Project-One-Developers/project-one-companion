import { formaUnixTimestampToItalianDate, getUnixTimestamp } from '@shared/libs/date/date-utils'
import type {
    Character,
    CharacterGameInfo,
    CharacterSummary,
    CharacterWithPlayer,
    CharacterWowAudit,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    NewPlayer,
    Player,
    PlayerWithCharacters
} from '@shared/types/types'
import {
    getDroptimizerLastByChar,
    getDroptimizerLatestList
} from '@storage/droptimizer/droptimizer.storage'
import { getLootAssigned } from '@storage/loots/loots.storage'
import {
    addCharacter,
    addCharacterWowAudit,
    deleteAllCharacterWowAudit,
    deleteCharacter,
    editCharacter,
    getAllCharacterWowAudit,
    getCharactersList,
    getCharactersWithPlayerList,
    getCharacterWithPlayerById,
    getLastCharacterWowAudit,
    getLastTimeSyncedWowAudit
} from '@storage/players/characters.storage'
import {
    addPlayer,
    deletePlayer,
    editPlayer,
    getPlayerById,
    getPlayerWithCharactersList
} from '@storage/players/players.storage'
import { getConfig } from '@storage/settings/settings.storage'
import {
    getLatestSyncDate,
    parseCurrencies,
    parseDroptimizerWarn,
    parseGreatVault,
    parseItemLevel,
    parseTiersetInfo,
    parseWowAuditWarn
} from '../loots/loot.utils'
import { fetchWowAuditData, parseWowAuditData } from './characters.utils'

// Characters

export const addCharacterHandler = async (character: NewCharacter): Promise<Character | null> => {
    const id = await addCharacter(character)
    return await getCharacterWithPlayerById(id)
}

export const getCharacterHandler = async (id: string): Promise<CharacterWithPlayer | null> => {
    return await getCharacterWithPlayerById(id)
}

export const getChracterListHandler = async (): Promise<Character[]> => {
    return await getCharactersWithPlayerList()
}

export const deleteCharacterHandler = async (id: string): Promise<void> => {
    return await deleteCharacter(id)
}

export const editCharacterHandler = async (edited: EditCharacter): Promise<Character | null> => {
    await editCharacter(edited)

    return await getCharacterWithPlayerById(edited.id)
}

export const syncCharacterWowAudit = async (): Promise<void> => {
    const key = await getConfig('WOW_AUDIT_API_KEY')

    if (key === null) {
        throw new Error('WOW_AUDIT_API_KEY not set in database')
    }

    console.log('[WowAudit] Start Sync')

    const json = await fetchWowAuditData(key)

    const lastSyncInWowAudit = await getLastTimeSyncedWowAudit()

    if (json != null) {
        const charsData = await parseWowAuditData(json)

        // if last sync is older than the last data in wowaudit
        if (!lastSyncInWowAudit || lastSyncInWowAudit <= charsData[0].wowauditLastModifiedUnixTs) {
            console.log(
                `[WowAudit] No Need to Sync - Last wowaudit sync ${formaUnixTimestampToItalianDate(
                    charsData[0].wowauditLastModifiedUnixTs
                )}`
            )
            return
        }

        await deleteAllCharacterWowAudit()
        await addCharacterWowAudit(charsData)
    }
    console.log('[WowAudit] End Sync')
}

export const checkWowAuditUpdates = async (): Promise<void> => {
    console.log('checkWowAuditUpdates: checking..')
    const lastSync = await getLastTimeSyncedWowAudit()
    const fourHoursUnixTs = 4 * 60 * 60

    if (lastSync === null || getUnixTimestamp() - lastSync > fourHoursUnixTs) {
        console.log(
            'checkWowAuditUpdates: woaudit older than 4 hours (' +
                (lastSync != null ? formaUnixTimestampToItalianDate(lastSync) : '') +
                ') - syncing now'
        )
        await syncCharacterWowAudit()
    } else {
        console.log(
            'checkWowAuditUpdates: woaudit is up to date (' +
                formaUnixTimestampToItalianDate(lastSync) +
                ')'
        )
    }
}

// Players

export const addPlayerHandler = async (player: NewPlayer): Promise<Player | null> => {
    const id = await addPlayer(player)
    return await getPlayerById(id)
}

export const deletePlayerHandler = async (playerId: string): Promise<void> => {
    return await deletePlayer(playerId)
}

export const editPlayerHandler = async (edited: EditPlayer): Promise<Player | null> => {
    await editPlayer(edited)

    return await getPlayerById(edited.id)
}

export const getPlayerWithCharactersListHandler = async (): Promise<PlayerWithCharacters[]> => {
    const players = await getPlayerWithCharactersList()
    return players
}

export const getCharLatestGameInfoHandler = async (
    charName: string,
    charRealm: string
): Promise<CharacterGameInfo> => {
    const lastDroptimizer = await getDroptimizerLastByChar(charName, charRealm)
    const lastWowAudit = await getLastCharacterWowAudit(charName, charRealm)

    return {
        droptimizer: lastDroptimizer,
        wowaudit: lastWowAudit
    }
}

export const getRosterSummaryHandler = async (): Promise<CharacterSummary[]> => {
    const [roster, latestDroptimizer, allAssignedLoots, wowAuditData] = await Promise.all([
        getCharactersList(),
        getDroptimizerLatestList(),
        getLootAssigned(),
        getAllCharacterWowAudit()
    ])

    const res: CharacterSummary[] = roster.map((char) => {
        // get latest droptimizers for a given chars
        const charDroptimizers = latestDroptimizer.filter(
            (dropt) => dropt.charInfo.name === char.name && dropt.charInfo.server === char.realm
        )

        const charWowAudit: CharacterWowAudit | null =
            wowAuditData.find(
                (wowaudit) => wowaudit.name === char.name && wowaudit.realm === char.realm
            ) ?? null

        // we consider all the loots assigned from last known simc / wow audit sync. we take all assignedif no char info
        const lowerBound = getLatestSyncDate(charDroptimizers, charWowAudit)

        // loot assigned to a given char
        const charAssignedLoots = !lowerBound
            ? []
            : allAssignedLoots.filter(
                  (l) => l.assignedCharacterId === char.id && l.dropDate > lowerBound
              )

        return {
            character: char,
            itemLevel: parseItemLevel(charDroptimizers, charWowAudit),
            weeklyChest: parseGreatVault(charDroptimizers),
            tierset: parseTiersetInfo(charDroptimizers, charAssignedLoots, charWowAudit),
            currencies: parseCurrencies(charDroptimizers),
            warnDroptimizer: parseDroptimizerWarn(charDroptimizers, charAssignedLoots),
            warnWowAudit: parseWowAuditWarn(charWowAudit)
        }
    })

    return res
}
