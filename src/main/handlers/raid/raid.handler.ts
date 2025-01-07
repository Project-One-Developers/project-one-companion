import { Boss } from '@shared/types/types'
import { getRaidLootTable } from '@storage/bosses/bosses.storage'

export const getRaidLootTableHanlder = async (raidId: number): Promise<Boss[]> => {
    return await getRaidLootTable(raidId)
}
