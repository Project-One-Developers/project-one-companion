import { NewCharacter, Player } from '../../../../shared/types/types'
import {
    addCharacter,
    addPlayer,
    getCharactersList
} from '../../lib/storage/players/players.storage'

export const addCharacterHandler = async (character: NewCharacter): Promise<Player> => {
    return await addCharacter(character)
}

export const getCharactersListHandler = async (): Promise<{ players: Player[] }> => {
    return await getCharactersList()
}

export const addPlayerHandler = async (playerName: string): Promise<Player> => {
    return await addPlayer(playerName)
}
