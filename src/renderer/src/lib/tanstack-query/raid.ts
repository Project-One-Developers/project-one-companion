import type { Boss, RaidSession } from 'shared/types/types'

export const fetchRaidLootTable = async (raidId: number): Promise<Boss[]> => {
    return await window.api.getRaidLootTable(raidId)
}

export const fetchRaidSessions = async (): Promise<RaidSession[]> => {
    return await window.api.getRaidSessions()
}
