import {
    CharAssignmentHighlights,
    Loot,
    LootAssignmentInfo,
    LootWithAssigned,
    LootWithItem,
    NewLootManual
} from '@shared/types/types'

export const addLootsManual = async (
    raidSessionId: string,
    loots: NewLootManual[]
): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsManual(raidSessionId, loots)
}

export const addLootsFromRc = async (raidSessionId: string, csv: string): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsFromRc(raidSessionId, csv)
}

export const getLootsBySession = async (raidSessionId: string): Promise<Loot[]> => {
    return await window.api.getLootsBySession(raidSessionId)
}

export const getLootsBySessionWithItem = async (raidSessionId: string): Promise<LootWithItem[]> => {
    return await window.api.getLootsBySessionWithItem(raidSessionId)
}

export const getLootsBySessionWithAssigned = async (
    raidSessionId: string
): Promise<LootWithAssigned[]> => {
    return await window.api.getLootsBySessionWithAssigned(raidSessionId)
}

export const getLootsWithAssignedBySessions = async (
    raidSessionIds: string[]
): Promise<LootWithAssigned[]> => {
    const lootsPromises = raidSessionIds.map((id) => getLootsBySessionWithAssigned(id))
    const lootsArrays = await Promise.all(lootsPromises)
    return lootsArrays.flat()
}

export const assignLoot = async (
    charId: string,
    lootId: string,
    highlights: CharAssignmentHighlights
) => {
    return await window.api.assignLoot(charId, lootId, highlights)
}

export const getLootAssignmentInfo = async (lootId: string): Promise<LootAssignmentInfo> => {
    return await window.api.getLootAssignmentInfo(lootId)
}
