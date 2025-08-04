import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
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
    getAllCharacterRaiderio,
    getLastRaiderioInfo
} from '@storage/players/characters-raiderio.storage'
import {
    getAllCharacterWowAudit,
    getLastWowAuditInfo
} from '@storage/players/characters-wowaudit.storage'
import {
    addCharacter,
    deleteCharacter,
    editCharacter,
    getCharactersList,
    getCharactersWithPlayerList,
    getCharacterWithPlayerById
} from '@storage/players/characters.storage'
import {
    addPlayer,
    deletePlayer,
    editPlayer,
    getPlayerById,
    getPlayerWithCharactersList
} from '@storage/players/players.storage'
import {
    getLatestSyncDate,
    parseCurrencies,
    parseDroptimizerWarn,
    parseGreatVault,
    parseItemLevel,
    parseRaiderioWarn,
    parseTiersetInfo,
    parseWowAuditWarn
} from '../loots/loot.utils'

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
    const [lastDroptimizer, lastWowAudit, lastRaiderio] = await Promise.all([
        getDroptimizerLastByChar(charName, charRealm),
        getLastWowAuditInfo(charName, charRealm),
        getLastRaiderioInfo(charName, charRealm)
    ])

    return {
        droptimizer: lastDroptimizer,
        wowaudit: lastWowAudit,
        raiderio: lastRaiderio
    }
}

export const getRosterSummaryHandler = async (): Promise<CharacterSummary[]> => {
    const [roster, latestDroptimizer, allAssignedLoots, wowAuditData, raiderioData] =
        await Promise.all([
            getCharactersList(),
            getDroptimizerLatestList(),
            getLootAssigned(),
            getAllCharacterWowAudit(),
            getAllCharacterRaiderio()
        ])

    const res: CharacterSummary[] = roster.map(char => {
        // get latest droptimizers for a given chars
        const charDroptimizers = latestDroptimizer.filter(
            dropt => dropt.charInfo.name === char.name && dropt.charInfo.server === char.realm
        )

        const charWowAudit: CharacterWowAudit | null =
            wowAuditData.find(
                wowaudit => wowaudit.name === char.name && wowaudit.realm === char.realm
            ) ?? null

        const charRaiderio: CharacterRaiderio | null =
            raiderioData.find(
                raiderio => raiderio.name === char.name && raiderio.realm === char.realm
            ) ?? null

        // we consider all the loots assigned from last known simc / wow audit sync. we take all assignedif no char info
        const lowerBound = getLatestSyncDate(charDroptimizers, charWowAudit, charRaiderio)

        // loot assigned to a given char
        const charAssignedLoots = !lowerBound
            ? []
            : allAssignedLoots.filter(
                  l => l.assignedCharacterId === char.id && l.dropDate > lowerBound
              )

        return {
            character: char,
            itemLevel: parseItemLevel(charDroptimizers, charWowAudit, charRaiderio),
            weeklyChest: parseGreatVault(charDroptimizers),
            tierset: parseTiersetInfo(
                charDroptimizers,
                charAssignedLoots,
                charWowAudit,
                charRaiderio
            ),
            currencies: parseCurrencies(charDroptimizers),
            warnDroptimizer: parseDroptimizerWarn(charDroptimizers, charAssignedLoots),
            warnWowAudit: parseWowAuditWarn(charWowAudit),
            warnRaiderio: parseRaiderioWarn(charRaiderio)
        }
    })

    return res
}
