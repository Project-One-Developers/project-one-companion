import type { EditRaidSession, NewRaidSession, RaidSession } from 'shared/types/types'

export const fetchRaidSessions = async (): Promise<RaidSession[]> => {
    return await window.api.getRaidSessions()
}

export const fetchRaidSession = async (id: string | undefined): Promise<RaidSession> => {
    if (!id) {
        throw new Error('No raid session id provided')
    }
    return await window.api.getRaidSession(id)
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
