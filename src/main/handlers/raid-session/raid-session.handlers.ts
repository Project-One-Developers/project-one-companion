import { EditRaidSession, NewRaidSession, RaidSession } from '@shared/types/types'
import {
    addRaidSession,
    deleteRaidSession,
    editRaidSession,
    getRaidSessionList,
    getRaidSessionWithCharPartecipation
} from '@storage/raid-session/raid-session.storage'

export const getRaidSessionHandler = async (id: string): Promise<RaidSession> => {
    return await getRaidSessionWithCharPartecipation(id)
}

export const getRaidSessionListHandler = async (): Promise<RaidSession[]> => {
    return await getRaidSessionList()
}

export const addRaidSessionHandler = async (raidSession: NewRaidSession): Promise<RaidSession> => {
    const id = await addRaidSession(raidSession)
    return await getRaidSessionWithCharPartecipation(id)
}

export const editRaidSessionHandler = async (
    editedRaidSession: EditRaidSession
): Promise<RaidSession> => {
    // edit
    await editRaidSession(editedRaidSession)

    // retrieve updated raid session
    return await getRaidSessionWithCharPartecipation(editedRaidSession.id)
}

export const deleteRaidSessionHandler = async (id: string): Promise<void> => {
    return await deleteRaidSession(id)
}
