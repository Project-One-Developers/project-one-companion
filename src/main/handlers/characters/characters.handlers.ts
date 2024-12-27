import { NewCharacter, Player } from '../../../../shared/types/types'
import { addCharacter, getCharactersList } from '../../lib/storage/players/players.storage'

export const addCharacterHandler = async (character: NewCharacter): Promise<Player> => {
    return await addCharacter(character)
}

export const getCharactersListHandler = async (): Promise<{ players: Player[] }> => {
    return await getCharactersList()
}
