import { addCharacterHandler } from './characters/characters.handlers'
import { addDroptimizerHandler } from './droptimizer/droptimizer.handlers'
import { reloadItemsHandler } from './items/items.handlers'

export const allHandlers = {
    'add-droptimizer': addDroptimizerHandler,
    'add-character': addCharacterHandler,
    'reload-items': reloadItemsHandler
}
