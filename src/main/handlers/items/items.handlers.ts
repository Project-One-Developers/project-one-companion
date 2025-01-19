import type { Item } from '@shared/types/types'
import { getItems, searchItems } from '@storage/items/items.storage'

export const getItemsHandler = async (): Promise<Item[]> => {
    return await getItems()
}

export const searchItemsHandler = async (searchTerm: string, limit: number): Promise<Item[]> => {
    const items = await searchItems(searchTerm, limit)
    return items
}
