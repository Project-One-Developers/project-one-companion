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

export const addLootsFromRc = async (
    raidSessionId: string,
    csv: string,
    importAssignedCharacter: boolean = false
): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsFromRc(raidSessionId, csv, importAssignedCharacter)
}

export const addLootAssignementsFromRc = async (
    raidSessionId: string,
    csv: string
): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootAssignementsFromRc(raidSessionId, csv)
}

export const addLootsFromMrt = async (raidSessionId: string, text: string): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsFromMrt(raidSessionId, text)
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
    const lootsPromises = raidSessionIds.map(id => getLootsBySessionWithAssigned(id))
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

export const unassignLoot = async (lootId: string) => {
    return await window.api.unassignLoot(lootId)
}

export const getLootAssignmentInfo = async (lootId: string): Promise<LootAssignmentInfo> => {
    return await window.api.getLootAssignmentInfo(lootId)
}

export const deleteLootById = async (lootId: string): Promise<void> => {
    return await window.api.deleteLoot(lootId)
}
