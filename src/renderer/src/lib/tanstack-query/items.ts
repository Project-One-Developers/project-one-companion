import type { Item } from 'shared/types/types'

export const searchItems = async (searchTerm: string): Promise<Item[]> => {
    const response = await window.api.searchItems(searchTerm, 10)
    return response
}

export const fetchItem = async (id: number): Promise<Item | null> => {
    const response = await window.api.getItem(id)
    return response
}
