import { getBossesHandler, getRaidLootTableHandler } from './bosses/bosses.handlers'
import {
    addCharacterHandler,
    addPlayerHandler,
    deleteCharacterHandler,
    deletePlayerHandler,
    editCharacterHandler,
    editPlayerHandler,
    getCharacterHandler,
    getCharLatestGameInfoHandler,
    getChracterListHandler,
    getPlayerWithCharactersListHandler,
    syncCharacterWowAudit
} from './characters/characters.handlers'
import {
    addDroptimizerHandler,
    deleteDroptimizerHandler,
    getDroptimizerLastByCharAndDiffHandler,
    getDroptimizerLatestListHandler,
    getDroptimizerListHandler,
    syncDroptimizersFromDiscord
} from './droptimizer/droptimizer.handlers'
import { getItemByIdHandler, getItemsHandler, searchItemsHandler } from './items/items.handlers'
import {
    addRaidLootsByManualInputHandler,
    addRaidLootsByRCLootCsvHandler,
    assignLootHandler,
    getLootsBySessionIdHandler,
    unassignLootHandler
} from './loots/loot.handlers'
import {
    addRaidSessionHandler,
    deleteRaidSessionHandler,
    editRaidSessionHandler,
    getRaidSessionHandler,
    getRaidSessionListHandler
} from './raid-session/raid-session.handlers'
import {
    getAppSettingsHandler,
    resetAppSettingsHandler,
    setAppSettingsHandler,
    upsertJsonDataHandler
} from './settings/settings.handlers'

export const allHandlers = {
    'droptimizer-add': addDroptimizerHandler,
    'droptimizer-list': getDroptimizerListHandler,
    'droptimizer-latest-list': getDroptimizerLatestListHandler,
    'droptimizer-delete': deleteDroptimizerHandler,
    'droptimizer-discord-sync': syncDroptimizersFromDiscord,
    'droptimizer-last-char-diff': getDroptimizerLastByCharAndDiffHandler,
    'character-add': addCharacterHandler,
    'character-get': getCharacterHandler,
    'character-list': getChracterListHandler,
    'character-delete': deleteCharacterHandler,
    'character-edit': editCharacterHandler,
    'character-sync-wowaudit': syncCharacterWowAudit,
    'character-game-info': getCharLatestGameInfoHandler,
    'player-add': addPlayerHandler,
    'player-delete': deletePlayerHandler,
    'player-edit': editPlayerHandler,
    'player-list': getPlayerWithCharactersListHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'item-get': getItemByIdHandler,
    'items-list': getItemsHandler,
    'items-search': searchItemsHandler,
    'boss-loot-table-get': getRaidLootTableHandler,
    'boss-list': getBossesHandler,
    'raid-session-list': getRaidSessionListHandler,
    'raid-session-get': getRaidSessionHandler,
    'raid-session-add': addRaidSessionHandler,
    'raid-session-edit': editRaidSessionHandler,
    'raid-session-delete': deleteRaidSessionHandler,
    'loots-add-rcloot': addRaidLootsByRCLootCsvHandler,
    'loots-add-manual': addRaidLootsByManualInputHandler,
    'loots-get-by-session': getLootsBySessionIdHandler,
    'loots-assign': assignLootHandler,
    'loots-unassign': unassignLootHandler,
    'app-settings-get': getAppSettingsHandler,
    'app-settings-edit': setAppSettingsHandler,
    'app-settings-reset': resetAppSettingsHandler
}
