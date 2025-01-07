import type { Boss } from 'shared/types/types'

export const fetchRaidLootTable = async (raidId: number): Promise<Boss[]> => {
    return await window.api.getRaidLootTable(raidId)
}
