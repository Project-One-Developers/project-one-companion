import { NewCharacter, Player } from 'shared/types/types'

export const fetchPlayers = async (): Promise<{ players: Player[] } | null> => {
    const response = await window.api.getCharactersList()
    return response
}

export const addCharacter = async (character: NewCharacter): Promise<Player | null> => {
    const response = await window.api.addCharacter(character)
    return response
}
