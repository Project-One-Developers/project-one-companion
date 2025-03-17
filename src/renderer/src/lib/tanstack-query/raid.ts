import type {
    EditRaidSession,
    NewRaidSession,
    RaidSession,
    RaidSessionWithRoster,
    RaidSessionWithSummary
} from 'shared/types/types'

export const fetchRaidSessionsWithSummary = async (): Promise<RaidSessionWithSummary[]> => {
    return await window.api.getRaidSessionsWithSummary()
}

export const fetchRaidSessionWithRoster = async (
    id: string | undefined
): Promise<RaidSessionWithRoster> => {
    if (!id) {
        throw new Error('No raid session id provided')
    }
    return await window.api.getRaidSessionWithRoster(id)
}

export const editRaidSession = async (editedRaidSession: EditRaidSession): Promise<RaidSession> => {
    return await window.api.editRaidSession(editedRaidSession)
}

export const addRaidSession = async (newRaidSession: NewRaidSession): Promise<RaidSession> => {
    return await window.api.addRaidSession(newRaidSession)
}

export const deleteRaidSession = async (id: string): Promise<void> => {
    return await window.api.deleteRaidSession(id)
}

export const cloneRaidSession = async (id: string): Promise<RaidSession> => {
    return await window.api.cloneRaidSession(id)
}

export const importRosterInRaidSession = async (
    raidSessionId: string,
    text: string
): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.importRosterInRaidSession(raidSessionId, text)
}
