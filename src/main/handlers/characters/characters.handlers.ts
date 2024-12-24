import { NewCharacter, Player } from '../../../../shared/types'
import { addCharacter } from '../../lib/storage/players/players.storage'

export const addCharacterHandler = async (character: NewCharacter): Promise<Player | null> => {
    return await addCharacter(character)
}
