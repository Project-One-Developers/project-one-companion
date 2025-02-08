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

export const getLootsBySessions = async (raidSessionIds: string[]): Promise<LootWithItem[]> => {
    const lootsPromises = raidSessionIds.map((id) => getLootsBySession(id))
    const lootsArrays = await Promise.all(lootsPromises)
    return lootsArrays.flat()
}

export const assignLoot = async (charId: string, lootId: string, score?: number) => {
    return await window.api.assignLoot(charId, lootId, score)
}
