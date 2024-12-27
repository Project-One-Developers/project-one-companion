import {
    addCharacterHandler,
    addPlayerHandler,
    getCharactersListHandler
} from './characters/characters.handlers'
import { addDroptimizerHandler } from './droptimizer/droptimizer.handlers'

export const allHandlers = {
    'add-droptimizer': addDroptimizerHandler,
    'add-character': addCharacterHandler,
    'get-characters-list': getCharactersListHandler,
    'add-player': addPlayerHandler
}
