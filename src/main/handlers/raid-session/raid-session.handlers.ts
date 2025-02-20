import { EditRaidSession, NewRaidSession, RaidSessionWithRoster } from '@shared/types/types'
import {
    addRaidSession,
    deleteRaidSession,
    editRaidSession,
    getRaidSessionList,
    getRaidSessionWithCharPartecipation
} from '@storage/raid-session/raid-session.storage'

export const getRaidSessionHandler = async (id: string): Promise<RaidSessionWithRoster> => {
    return await getRaidSessionWithCharPartecipation(id)
}

export const getRaidSessionListHandler = async (): Promise<RaidSessionWithRoster[]> => {
    return await getRaidSessionList()
}

export const addRaidSessionHandler = async (
    raidSession: NewRaidSession
): Promise<RaidSessionWithRoster> => {
    const id = await addRaidSession(raidSession)
    return await getRaidSessionWithCharPartecipation(id)
}

export const editRaidSessionHandler = async (
    editedRaidSession: EditRaidSession
): Promise<RaidSessionWithRoster> => {
    // edit
    await editRaidSession(editedRaidSession)

    // retrieve updated raid session
    return await getRaidSessionWithCharPartecipation(editedRaidSession.id)
}

export const deleteRaidSessionHandler = async (id: string): Promise<void> => {
    return await deleteRaidSession(id)
}
