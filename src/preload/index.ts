import { electronAPI } from '@electron-toolkit/preload'
import { Droptimizer, NewCharacter, Player } from '@shared/types/types'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
export const api = {
    addDroptimizer(url: string): Promise<Droptimizer> {
        return ipcRenderer.invoke('add-droptimizer', url)
    },
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
