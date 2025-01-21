import { LootWithItem, NewLootsFromManualInput, NewLootsFromRc } from '@shared/types/types'

export const addLootsManual = async (loots: NewLootsFromManualInput): Promise<void> => {
    //const response = await window.api.searchItems(searchTerm, 10)
    if (!loots.raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsManual(loots)
}

export const addLootsFromRc = async (loots: NewLootsFromRc): Promise<void> => {
    //const response = await window.api.searchItems(searchTerm, 10)
    if (!loots.raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsFromRc(loots)
}

export const getLootsBySession = async (raidSessionId: string): Promise<LootWithItem[]> => {
    return await window.api.getLootsBySession(raidSessionId)
}
