import type { Boss, BossWithItems } from 'shared/types/types'

export const fetchRaidLootTable = async (raidId: number): Promise<BossWithItems[]> => {
    return await window.api.getRaidLootTable(raidId)
}

export const fetchBosses = async (raidId: number): Promise<Boss[]> => {
    return await window.api.getBosses(raidId)
}
