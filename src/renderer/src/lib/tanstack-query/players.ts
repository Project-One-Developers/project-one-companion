import type {
    Character,
    CharacterWithPlayer,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    NewPlayer,
    Player,
    PlayerWithCharacters
} from 'shared/types/types'

// characters

export const addCharacter = async (character: NewCharacter): Promise<Character> => {
    const response = await window.api.addCharacter(character)
    return response
}

export const fetchCharacter = async (id: string | undefined): Promise<CharacterWithPlayer> => {
    if (!id) {
        throw new Error('No raid session id provided')
    }
    return await window.api.getCharacter(id)
}

export const fetchCharacters = async (): Promise<Character[]> => {
    const response = await window.api.getCharactersList()
    return response
}

export const deleteCharacter = async (id: string): Promise<void> => {
    const response = await window.api.deleteCharacter(id)
    return response
}

export const editCharacter = async (edited: EditCharacter): Promise<Character> => {
    return await window.api.editCharacter(edited)
}

// players

export const fetchPlayers = async (): Promise<PlayerWithCharacters[]> => {
    const response = await window.api.getPlayerWithCharList()
    return response
}

export const addPlayer = async (player: NewPlayer): Promise<Player> => {
    const response = await window.api.addPlayer(player)
    return response
}

export const deletePlayer = async (id: string): Promise<void> => {
    const response = await window.api.deletePlayer(id)
    return response
}

export const editPlayer = async (edited: EditPlayer): Promise<Player> => {
    return await window.api.editPlayer(edited)
}
