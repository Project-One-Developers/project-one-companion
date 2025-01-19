import {
    EditRaidSession,
    NewLootsFromManualInput,
    NewLootsFromRc,
    NewRaidSession,
    RaidSession
} from '@shared/types/types'
import {
    addRaidSession,
    deleteRaidSession,
    editRaidSession,
    getRaidSession,
    getRaidSessionList
} from '@storage/raid-session/raid-session.storage'
import { parseRaidSessionCsv } from './raid-session.utils'

export const addRaidLootsByRCLootCsvHandler = async (loot: NewLootsFromRc): Promise<void> => {
    const parsedData = await parseRaidSessionCsv(loot.raidSessionId, loot.csv)
    console.log(parsedData)

    // TODO: insertion
}

export const addRaidLootsByManualInputHandler = async (
    loot: NewLootsFromManualInput
): Promise<void> => {
    //const parsedData = await parseRaidSessionCsv(loot.raidSessionId, loot.csv)
    console.log(loot)

    // TODO: insertion
}

export const getRaidSessionHandler = async (id: string): Promise<RaidSession> => {
    return await getRaidSession(id)
}

export const getRaidSessionListHandler = async (): Promise<RaidSession[]> => {
    return await getRaidSessionList()
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
