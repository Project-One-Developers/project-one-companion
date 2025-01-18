import type {
    Character,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    Player
} from '@shared/types/types'
import {
    addCharacter,
    addPlayer,
    deleteCharacter,
    deletePlayer,
    editCharacter,
    editPlayer,
    getCharacterById,
    getPlayerById,
    getPlayerWithCharactersList
} from '@storage/players/players.storage'

// Characters

export const addCharacterHandler = async (character: NewCharacter): Promise<Player> => {
    return await addCharacter(character)
}

export const deleteCharacterHandler = async (id: string): Promise<void> => {
    return await deleteCharacter(id)
}

export const editCharacterHandler = async (edited: EditCharacter): Promise<Character | null> => {
    // edit
    await editCharacter(edited)

    // retrieve updated entity
    return await getCharacterById(edited.id)
}

// export const getCharacterListHandler = async (): Promise<Character[]> => {
//     const players = await getPlayerWithCharactersList()
//     return players
// }

// Players

export const addPlayerHandler = async (playerName: string): Promise<Player> => {
    return await addPlayer(playerName)
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

export const getPlayerWithCharactersListHandler = async (): Promise<Player[]> => {
    const players = await getPlayerWithCharactersList()
    return players
}
