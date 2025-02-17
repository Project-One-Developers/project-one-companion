/* eslint-disable @typescript-eslint/ban-ts-comment */
import { electronAPI } from '@electron-toolkit/preload'
import type {
    AppSettings,
    BisList,
    Boss,
    BossWithItems,
    Character,
    CharacterGameInfo,
    CharacterWithPlayer,
    Droptimizer,
    EditCharacter,
    EditPlayer,
    EditRaidSession,
    Item,
    Loot,
    LootAssignmentInfo,
    LootWithAssigned,
    LootWithItem,
    NewCharacter,
    NewLootManual,
    NewPlayer,
    NewRaidSession,
    Player,
    PlayerWithCharacters,
    RaidSession,
    WowRaidDifficulty
} from '@shared/types/types'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
export const api = {
    // Characters
    addCharacter(character: NewCharacter): Promise<Character> {
        return ipcRenderer.invoke('character-add', character)
    },
    getCharacter(id: string): Promise<CharacterWithPlayer> {
        return ipcRenderer.invoke('character-get', id)
    },
    getCharactersList(): Promise<Character[]> {
        return ipcRenderer.invoke('character-list')
    },
    deleteCharacter(id: string): Promise<void> {
        return ipcRenderer.invoke('character-delete', id)
    },
    editCharacter(edited: EditCharacter): Promise<Character> {
        return ipcRenderer.invoke('character-edit', edited)
    },
    getCharacterGameInfo(charName: string, charRealm: string): Promise<CharacterGameInfo> {
        return ipcRenderer.invoke('character-game-info', charName, charRealm)
    },
    syncWowAudit(): Promise<void> {
        return ipcRenderer.invoke('character-sync-wowaudit')
    },
    getPlayerWithCharList(): Promise<PlayerWithCharacters[]> {
        return ipcRenderer.invoke('player-list')
    },
    addPlayer(player: NewPlayer): Promise<Player> {
        return ipcRenderer.invoke('player-add', player)
    },
    editPlayer(player: EditPlayer): Promise<Player> {
        return ipcRenderer.invoke('player-edit', player)
    },
    deletePlayer(id: string): Promise<void> {
        return ipcRenderer.invoke('player-delete', id)
    },
    // Droptimizers
    addDroptimizer(url: string): Promise<Droptimizer> {
        return ipcRenderer.invoke('droptimizer-add', url)
    },
    getDroptimizerList(): Promise<Droptimizer[]> {
        return ipcRenderer.invoke('droptimizer-list')
    },
    getDroptimizerLatestList(): Promise<Droptimizer[]> {
        return ipcRenderer.invoke('droptimizer-latest-list')
    },
    getDroptimizerLastByCharAndDiff(
        charName: string,
        charRealm: string,
        diff: WowRaidDifficulty
    ): Promise<Droptimizer | null> {
        return ipcRenderer.invoke('droptimizer-last-char-diff', charName, charRealm, diff)
    },
    deleteDroptimizer(url: string): Promise<void> {
        return ipcRenderer.invoke('droptimizer-delete', url)
    },
    syncDroptimizerFromDiscord(): Promise<void> {
        return ipcRenderer.invoke('droptimizer-discord-sync')
    },
    // Bosses
    getBosses(raidId: number): Promise<Boss[]> {
        return ipcRenderer.invoke('boss-list', raidId)
    },
    getRaidLootTable(raidId: number): Promise<BossWithItems[]> {
        return ipcRenderer.invoke('boss-loot-table-get', raidId)
    },
    // Raid sessions
    addRaidSession(newSession: NewRaidSession): Promise<RaidSession> {
        return ipcRenderer.invoke('raid-session-add', newSession)
    },
    editRaidSession(editedSession: EditRaidSession): Promise<RaidSession> {
        return ipcRenderer.invoke('raid-session-edit', editedSession)
    },
    getRaidSession(id: string): Promise<RaidSession> {
        return ipcRenderer.invoke('raid-session-get', id)
    },
    getRaidSessions(): Promise<RaidSession[]> {
        return ipcRenderer.invoke('raid-session-list')
    },
    deleteRaidSession(id: string): Promise<void> {
        return ipcRenderer.invoke('raid-session-delete', id)
    },
    // Loots
    addLootsManual(raidSessionId: string, loots: NewLootManual[]): Promise<void> {
        return ipcRenderer.invoke('loots-add-manual', raidSessionId, loots)
    },
    addLootsFromRc(raidSessionId: string, csv: string): Promise<void> {
        return ipcRenderer.invoke('loots-add-rcloot', raidSessionId, csv)
    },
    getLootsBySession(sessionId: string): Promise<Loot[]> {
        return ipcRenderer.invoke('loots-get-by-session', sessionId)
    },
    getLootsBySessionWithAssigned(sessionId: string): Promise<LootWithAssigned[]> {
        return ipcRenderer.invoke('loots-get-by-session-with-assigned', sessionId)
    },
    getLootsBySessionWithItem(sessionId: string): Promise<LootWithItem[]> {
        return ipcRenderer.invoke('loots-get-by-session-with-item', sessionId)
    },
    getLootAssignmentInfo(lootId: string): Promise<LootAssignmentInfo> {
        return ipcRenderer.invoke('loots-assign-info', lootId)
    },
    assignLoot(charId: string, lootId: string, score?: number) {
        return ipcRenderer.invoke('loots-assign', charId, lootId, score)
    },
    unassignLoot(lootId: string) {
        return ipcRenderer.invoke('loots-unassign', lootId)
    },
    // App settings
    getAppSettings(): Promise<AppSettings> {
        return ipcRenderer.invoke('app-settings-get')
    },
    editAppSettings(settings: AppSettings): Promise<void> {
        return ipcRenderer.invoke('app-settings-edit', settings)
    },
    resetAppSettings(): Promise<void> {
        return ipcRenderer.invoke('app-settings-reset')
    },
    // JSON Data
    upsertJsonData(): Promise<void> {
        return ipcRenderer.invoke('upsert-json-data')
    },
    // Items
    getItem(id: number): Promise<Item | null> {
        return ipcRenderer.invoke('item-get', id)
    },
    getItems(): Promise<Item[]> {
        return ipcRenderer.invoke('items-list')
    },
    searchItems(searchTerm: string, limit: number): Promise<Item[]> {
        return ipcRenderer.invoke('items-search', searchTerm, limit)
    },
    // bis list
    getBisList(): Promise<BisList[]> {
        return ipcRenderer.invoke('bis-list-get')
    },
    updateItemBisSpecs(itemId: number, specIds: number[]): Promise<void> {
        return ipcRenderer.invoke('bis-list-edit', itemId, specIds)
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
