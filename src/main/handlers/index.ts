import {
    addCharacterHandler,
    addPlayerHandler,
    deleteCharacterHandler,
    deletePlayerHandler,
    editCharacterHandler,
    editPlayerHandler,
    getPlayerWithCharactersListHandler
} from './characters/characters.handlers'
import {
    addDroptimizerHandler,
    deleteDroptimizerHandler,
    getDroptimizerListHandler,
    syncDroptimizersFromDiscord
} from './droptimizer/droptimizer.handlers'
import { getItemsHandler } from './items/items.handlers'
import { upsertJsonDataHandler } from './json-data/json-data.handlers'
import {
    addRaidLootsByRCLootCsvHandler,
    addRaidSessionHandler,
    deleteRaidSessionHandler,
    editRaidSessionHandler,
    getRaidSessionHandler,
    getRaidSessionListHandler
} from './raid-session/raid-session.handlers'
import { getRaidLootTableHanlder } from './raid/raid.handler'
import {
    getAppSettingsHandler,
    resetAppSettingsHandler,
    setAppSettingsHandler
} from './settings/settings.handlers'

export const allHandlers = {
    'droptimizer-add': addDroptimizerHandler,
    'droptimizer-list': getDroptimizerListHandler,
    'droptimizer-delete': deleteDroptimizerHandler,
    'droptimizer-discord-sync': syncDroptimizersFromDiscord,
    'character-add': addCharacterHandler,
    //'character-list': todo,
    'character-delete': deleteCharacterHandler,
    'character-edit': editCharacterHandler,
    'player-add': addPlayerHandler,
    'player-delete': deletePlayerHandler,
    'player-edit': editPlayerHandler,
    'player-list': getPlayerWithCharactersListHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'get-items': getItemsHandler,
    'loot-table-get': getRaidLootTableHanlder,
    'raid-session-list': getRaidSessionListHandler,
    'raid-session-get': getRaidSessionHandler,
    'raid-session-add': addRaidSessionHandler,
    'raid-session-edit': editRaidSessionHandler,
    'raid-session-delete': deleteRaidSessionHandler,
    'add-raid-session-loots-rcloot': addRaidLootsByRCLootCsvHandler,
    'app-settings-get': getAppSettingsHandler,
    'app-settings-set': setAppSettingsHandler,
    'app-settings-reset': resetAppSettingsHandler
}
