import type { Boss, Item } from '@shared/types/types'
import { getRaidLootTable } from '@storage/bosses/bosses.storage'
import { getItems, searchItems } from '@storage/items/items.storage'

export const getItemsHandler = async (): Promise<Item[]> => {
    return await getItems()
}

export const getRaidLootTableHanlder = async (raidId: number): Promise<Boss[]> => {
    return await getRaidLootTable(raidId)
}

export const searchItemsHandler = async (searchTerm: string, limit: number): Promise<Item[]> => {
    const items = await searchItems(searchTerm, limit)
    return items
}
