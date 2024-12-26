import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { Droptimizer, NewCharacter, Player } from '../../shared/types/types'

// Custom APIs for renderer
export const api = {
    addDroptimizer(url: string): Promise<Droptimizer | null> {
        return ipcRenderer.invoke('add-droptimizer', url)
    },
    addCharacter(character: NewCharacter): Promise<Player | null> {
        return ipcRenderer.invoke('add-character', character)
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
