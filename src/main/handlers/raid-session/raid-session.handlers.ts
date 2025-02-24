import {
    EditRaidSession,
    NewRaidSession,
    RaidSession,
    RaidSessionWithRoster,
    RaidSessionWithSummary
} from '@shared/types/types'
import {
    addRaidSession,
    deleteRaidSession,
    editRaidSession,
    getRaidSession,
    getRaidSessionWithRoster,
    getRaidSessionWithSummaryList
} from '@storage/raid-session/raid-session.storage'
import { getUnixTimestamp, newUUID } from '@utils'

export const getRaidSessionWithRosterHandler = async (
    id: string
): Promise<RaidSessionWithRoster> => {
    return await getRaidSessionWithRoster(id)
}

export const getRaidSessionWithSummaryListHandler = async (): Promise<RaidSessionWithSummary[]> => {
    return await getRaidSessionWithSummaryList()
}

export const addRaidSessionHandler = async (raidSession: NewRaidSession): Promise<RaidSession> => {
    const id = await addRaidSession(raidSession)
    return await getRaidSession(id)
}

export const editRaidSessionHandler = async (
    editedRaidSession: EditRaidSession
): Promise<RaidSession> => {
    // edit
    await editRaidSession(editedRaidSession)

    // retrieve updated raid session
    return await getRaidSession(editedRaidSession.id)
}

export const deleteRaidSessionHandler = async (id: string): Promise<void> => {
    return await deleteRaidSession(id)
}

export const cloneRaidSessionHandler = async (id: string): Promise<RaidSession> => {
    const source = await getRaidSessionWithRoster(id)
    const cloned: NewRaidSession = {
        name: source.name + '-' + newUUID().slice(0, 6),
        raidDate: getUnixTimestamp(), // set now as session date
        roster: source.roster.map((r) => r.id)
    }
    return await addRaidSessionHandler(cloned)
}
