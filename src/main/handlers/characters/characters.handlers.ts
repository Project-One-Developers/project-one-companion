import { NewCharacter, Player } from '../../../../shared/types/types'
import { addCharacter } from '../../lib/storage/players/players.storage'

export const addCharacterHandler = async (character: NewCharacter): Promise<Player> => {
    return await addCharacter(character)
}
