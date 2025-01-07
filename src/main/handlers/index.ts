import {
    addCharacterHandler,
    addPlayerHandler,
    deletePlayerHandler,
    getCharactersListHandler
} from './characters/characters.handlers'
import {
    addDroptimizerHandler,
    getDroptimizerListHandler
} from './droptimizer/droptimizer.handlers'
import { getItemsHandler } from './items/items.handlers'
import { upsertJsonDataHandler } from './json-data/json-data.handlers'
import { getRaidLootTableHanlder } from './raid/raid.handler'

export const allHandlers = {
    'add-droptimizer': addDroptimizerHandler,
    'get-droptimizer-list': getDroptimizerListHandler,
    'add-character': addCharacterHandler,
    'get-characters-list': getCharactersListHandler,
    'add-player': addPlayerHandler,
    'delete-player': deletePlayerHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'get-items': getItemsHandler,
    'get-raid-loot-table': getRaidLootTableHanlder
}
