import type { Boss, BossWithItems } from '@shared/types/types'
import { getBosses, getRaidLootTable } from '@storage/bosses/bosses.storage'

export const getRaidLootTableHandler = async (raidId: number): Promise<BossWithItems[]> => {
    return await getRaidLootTable(raidId)
}

export const getBossesHandler = async (raidId: number): Promise<Boss[]> => {
    return await getBosses(raidId)
}
