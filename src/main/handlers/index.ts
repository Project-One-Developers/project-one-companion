import { getBisListHandler, updateItemBisSpecHandler } from './bis-list/bis-list.handlers'
import { fetchRosterProgressionHandler } from './bosses/bosses-progression.handlers'
import { getBossesHandler, getRaidLootTableHandler } from './bosses/bosses.handlers'
import { syncCharacterRaiderio } from './characters/characters-raiderio.handlers'
import { syncCharacterWowAudit } from './characters/characters-wowaudit.handlers'
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
    getRosterSummaryHandler
} from './characters/characters.handlers'
import {
    addSimulationHandler,
    deleteDroptimizerHandler,
    deleteSimulationsOlderThanHoursHandler,
    getDroptimizerLastByCharAndDiffHandler,
    getDroptimizerLatestListHandler,
    getDroptimizerListHandler,
    syncDroptimizersFromDiscord
} from './droptimizer/droptimizer.handlers'
import { addSimcHandler } from './droptimizer/simc.handlers'
import { getItemByIdHandler, getItemsHandler, searchItemsHandler } from './items/items.handlers'
import {
    deleteItemNoteHandler,
    getAllItemNotesHandler,
    getItemNoteHandler,
    setItemNoteHandler
} from './items/itemsNote.handlers'
import {
    addRaidLootsByManualInputHandler,
    addRaidLootsByMrtHandler,
    addRaidLootsByRCLootCsvHandler,
    assignLootHandler,
    deleteLootHandler,
    getCharactersWithLootsByItemIdHandler,
    getLootAssignmentInfoHandler,
    getLootsBySessionIdHandler,
    getLootsBySessionIdWithAssignedHandler,
    getLootsBySessionIdWithItemHandler,
    tradeLootHandler,
    unassignLootHandler,
    untradeLootHandler
} from './loots/loot.handlers'
import {
    addRaidSessionHandler,
    cloneRaidSessionHandler,
    deleteRaidSessionHandler,
    editRaidSessionHandler,
    getRaidSessionWithRosterHandler,
    getRaidSessionWithSummaryListHandler,
    importRosterInRaidSessionHandler
} from './raid-session/raid-session.handlers'
import {
    getAppSettingsHandler,
    resetAppSettingsHandler,
    setAppSettingsHandler,
    upsertJsonDataHandler
} from './settings/settings.handlers'

export const allHandlers = {
    'simc-add': addSimcHandler,
    'droptimizer-add': addSimulationHandler,
    'droptimizer-list': getDroptimizerListHandler,
    'droptimizer-latest-list': getDroptimizerLatestListHandler,
    'droptimizer-delete': deleteDroptimizerHandler,
    'droptimizer-cleanup': deleteSimulationsOlderThanHoursHandler,
    'droptimizer-discord-sync': syncDroptimizersFromDiscord,
    'droptimizer-last-char-diff': getDroptimizerLastByCharAndDiffHandler,
    'character-add': addCharacterHandler,
    'character-get': getCharacterHandler,
    'character-list': getChracterListHandler,
    'character-delete': deleteCharacterHandler,
    'character-edit': editCharacterHandler,
    'character-sync-wowaudit': syncCharacterWowAudit,
    'character-sync-raiderio': syncCharacterRaiderio,
    'character-game-info': getCharLatestGameInfoHandler,
    'character-roster-summary': getRosterSummaryHandler,
    'characters-by-itemid': getCharactersWithLootsByItemIdHandler,
    'player-add': addPlayerHandler,
    'player-delete': deletePlayerHandler,
    'player-edit': editPlayerHandler,
    'player-list': getPlayerWithCharactersListHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'item-get': getItemByIdHandler,
    'items-list': getItemsHandler,
    'items-search': searchItemsHandler,
    'item-get-note': getItemNoteHandler,
    'item-get-all-notes': getAllItemNotesHandler,
    'item-set-note': setItemNoteHandler,
    'item-delete-note': deleteItemNoteHandler,
    'boss-loot-table-get': getRaidLootTableHandler,
    'boss-list': getBossesHandler,
    'raid-session-list': getRaidSessionWithSummaryListHandler,
    'raid-session-get': getRaidSessionWithRosterHandler,
    'raid-session-add': addRaidSessionHandler,
    'raid-session-edit': editRaidSessionHandler,
    'raid-session-delete': deleteRaidSessionHandler,
    'raid-session-clone': cloneRaidSessionHandler,
    'raid-session-roster-import': importRosterInRaidSessionHandler,
    'raid-progression-get': fetchRosterProgressionHandler,
    'loots-add-rcloot': addRaidLootsByRCLootCsvHandler,
    'loots-add-mrt': addRaidLootsByMrtHandler,
    'loots-add-manual': addRaidLootsByManualInputHandler,
    'loots-get-by-session': getLootsBySessionIdHandler,
    'loots-get-by-session-with-assigned': getLootsBySessionIdWithAssignedHandler,
    'loots-get-by-session-with-item': getLootsBySessionIdWithItemHandler,
    'loots-assign-info': getLootAssignmentInfoHandler,
    'loots-assign': assignLootHandler,
    'loots-unassign': unassignLootHandler,
    'loots-trade': tradeLootHandler,
    'loots-untrade': untradeLootHandler,
    'loots-delete-by-id': deleteLootHandler,
    'app-settings-get': getAppSettingsHandler,
    'app-settings-edit': setAppSettingsHandler,
    'app-settings-reset': resetAppSettingsHandler,
    'bis-list-get': getBisListHandler,
    'bis-list-edit': updateItemBisSpecHandler
}
