import {
    addCharacterHandler,
    addPlayerHandler,
    deletePlayerHandler,
    getCharactersListHandler
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
    'add-character': addCharacterHandler,
    'get-characters-list': getCharactersListHandler,
    'add-player': addPlayerHandler,
    'delete-player': deletePlayerHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'get-items': getItemsHandler,
    'get-raid-loot-table': getRaidLootTableHanlder,
    'get-raid-sessions': getRaidSessionListHandler,
    'get-raid-session': getRaidSessionHandler,
    'add-raid-session': addRaidSessionHandler,
    'edit-raid-session': editRaidSessionHandler,
    'delete-raid-session': deleteRaidSessionHandler,
    'add-raid-session-loots-rcloot': addRaidLootsByRCLootCsvHandler,
    'app-settings-get': getAppSettingsHandler,
    'app-settings-set': setAppSettingsHandler,
    'app-settings-reset': resetAppSettingsHandler
}
