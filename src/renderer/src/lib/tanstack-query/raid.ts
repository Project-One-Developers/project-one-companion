import type { EditRaidSession, NewRaidSession, RaidSessionWithRoster } from 'shared/types/types'

export const fetchRaidSessions = async (): Promise<RaidSessionWithRoster[]> => {
    return await window.api.getRaidSessions()
}

export const fetchRaidSessionsWithLoots = async (): Promise<RaidSessionWithRoster[]> => {
    return await window.api.getRaidSessions()
}

export const fetchRaidSession = async (id: string | undefined): Promise<RaidSessionWithRoster> => {
    if (!id) {
        throw new Error('No raid session id provided')
    }
    return await window.api.getRaidSession(id)
}

export const editRaidSession = async (
    editedRaidSession: EditRaidSession
): Promise<RaidSessionWithRoster> => {
    return await window.api.editRaidSession(editedRaidSession)
}

export const addRaidSession = async (
    newRaidSession: NewRaidSession
): Promise<RaidSessionWithRoster> => {
    return await window.api.addRaidSession(newRaidSession)
}

export const deleteRaidSession = async (id: string): Promise<void> => {
    return await window.api.deleteRaidSession(id)
}
