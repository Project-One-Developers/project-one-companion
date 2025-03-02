import { getUnixTimestamp } from '@shared/libs/date/date-utils'
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
    getLastWowAuditSync
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
    const res = await getCharactersWithPlayerList()
    return res
}

export const deleteCharacterHandler = async (id: string): Promise<void> => {
    return await deleteCharacter(id)
}

export const editCharacterHandler = async (edited: EditCharacter): Promise<Character | null> => {
    // edit
    await editCharacter(edited)

    // retrieve updated entity
    return await getCharacterWithPlayerById(edited.id)
}

export const syncCharacterWowAudit = async (): Promise<void> => {
    const key = await getConfig('WOW_AUDIT_API_KEY')

    if (key === null) {
        throw new Error('WOW_AUDIT_API_KEY not set in database')
    }

    console.log('[WowAudit] Start Sync')

    const json = await fetchWowAuditData(key)

    if (json != null) {
        const charsData = await parseWowAuditData(json)
        await deleteAllCharacterWowAudit()
        await addCharacterWowAudit(charsData)
    }
    console.log('[WowAudit] End Sync')
}

export const checkWowAuditUpdates = async (): Promise<void> => {
    const lastSync = await getLastWowAuditSync()
    const threeHoursUnixTs = 3 * 60 * 60 * 1000

    if (lastSync === null || getUnixTimestamp() - lastSync > threeHoursUnixTs) {
        console.log('syncCharacterWowAudit: data older than 3hours - syncing now')
        await syncCharacterWowAudit()
    }
}

// export const getCharacterListHandler = async (): Promise<Character[]> => {
//     const players = await getPlayerWithCharactersList()
//     return players
// }

// Players

export const addPlayerHandler = async (player: NewPlayer): Promise<Player | null> => {
    const id = await addPlayer(player)
    return await getPlayerById(id)
}

export const deletePlayerHandler = async (playerId: string): Promise<void> => {
    return await deletePlayer(playerId)
}

export const editPlayerHandler = async (edited: EditPlayer): Promise<Player | null> => {
    // edit
    await editPlayer(edited)

    // retrieve updated entity
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

    const res: CharacterGameInfo = {
        droptimizer: lastDroptimizer,
        wowaudit: lastWowAudit
    }

    return res
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

        const droptimizerLastUpdate: number | null = Math.max(
            ...charDroptimizers.map((c) => c.simInfo.date)
        )
        //let wowAuditLastUpdate: number | null = charWowAudit?.wowauditLastModifiedUnixTs ?? null

        // loot assgined to a given char
        const charAssignedLoots = allAssignedLoots.filter(
            (l) =>
                l.assignedCharacterId === char.id &&
                (!droptimizerLastUpdate || l.dropDate > droptimizerLastUpdate) // we consider all the loots assigned from last known simc. we take all assignedif no char info
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
