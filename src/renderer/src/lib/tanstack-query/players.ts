import type { NewCharacter, Player } from 'shared/types/types'

export const fetchPlayers = async (): Promise<Player[]> => {
    const response = await window.api.getCharactersList()
    return response
}

export const addCharacter = async (character: NewCharacter): Promise<Player | null> => {
    const response = await window.api.addCharacter(character)
    return response
}

export const addPlayer = async (playerName: string): Promise<Player | null> => {
    const response = await window.api.addPlayer(playerName)
    return response
}

export const deletePlayer = async (playerId: string): Promise<void> => {
    const response = await window.api.deletePlayer(playerId)
    return response
}
