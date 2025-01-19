import type { Item } from 'shared/types/types'

export const searchItems = async (searchTerm: string): Promise<Item[]> => {
    const response = await window.api.searchItems(searchTerm, 10)
    return response
}
