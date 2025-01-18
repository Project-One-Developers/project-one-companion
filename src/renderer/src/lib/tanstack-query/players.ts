import type {
    Character,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    NewPlayer,
    Player
} from 'shared/types/types'

// characters

export const addCharacter = async (character: NewCharacter): Promise<Character> => {
    const response = await window.api.addCharacter(character)
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

export const fetchPlayers = async (): Promise<Player[]> => {
    const response = await window.api.getPlayerList()
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
