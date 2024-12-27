import { Player } from 'shared/types/types'

export const fetchPlayers = async (): Promise<{ players: Player[] } | null> => {
    const response = await window.electron.ipcRenderer.invoke('get-characters-list')
    return response
}
