import type { Item } from '@shared/types/types'
import { getItem, getItems, searchItems } from '@storage/items/items.storage'

export const getItemsHandler = async (): Promise<Item[]> => {
    return await getItems()
}

export const getItemByIdHandler = async (id: number): Promise<Item | null> => {
    return await getItem(id)
}

export const searchItemsHandler = async (searchTerm: string, limit: number): Promise<Item[]> => {
    return await searchItems(searchTerm, limit)
}
