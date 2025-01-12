/* eslint-disable @typescript-eslint/ban-ts-comment */
import { electronAPI } from '@electron-toolkit/preload'
import type {
    Boss,
    Droptimizer,
    Item,
    NewCharacter,
    NewRaidSession,
    Player,
    RaidSession
} from '@shared/types/types'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
export const api = {
    // Characters
    addCharacter(character: NewCharacter): Promise<Player> {
        return ipcRenderer.invoke('add-character', character)
    },
    getCharactersList(): Promise<{ players: Player[] }> {
        return ipcRenderer.invoke('get-characters-list')
    },
    addPlayer(playerName: string): Promise<Player> {
        return ipcRenderer.invoke('add-player', playerName)
    },
    deletePlayer(playerId: string): Promise<void> {
        return ipcRenderer.invoke('delete-player', playerId)
    },
    // Simulations
    addDroptimizer(url: string): Promise<Droptimizer> {
        return ipcRenderer.invoke('add-droptimizer', url)
    },
    getDroptimizerList(): Promise<Droptimizer[]> {
        return ipcRenderer.invoke('get-droptimizer-list')
    },
    // Raid loot table
    getRaidLootTable(raidId: number): Promise<Boss[]> {
        return ipcRenderer.invoke('get-raid-loot-table', raidId)
    },
    // Raid sessions
    addRaidSession(newSession: NewRaidSession): Promise<RaidSession> {
        return ipcRenderer.invoke('add-raid-session', newSession)
    },
    getRaidSession(id: string): Promise<RaidSession> {
        return ipcRenderer.invoke('get-raid-session', id)
    },
    getRaidSessions(): Promise<RaidSession[]> {
        return ipcRenderer.invoke('get-raid-sessions')
    },
    deleteRaidSession(id: string): Promise<void> {
        return ipcRenderer.invoke('delete-raid-session', id)
    },
    // JSON Data
    getItems(): Promise<Item[]> {
        return ipcRenderer.invoke('get-items')
    },
    upsertJsonData(): Promise<void> {
        return ipcRenderer.invoke('upsert-json-data')
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
