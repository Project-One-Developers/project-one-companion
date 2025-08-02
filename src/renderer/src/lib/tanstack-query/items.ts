import type { CharacterWithGears, Item, ItemNote } from 'shared/types/types'

export const searchItems = async (searchTerm: string): Promise<Item[]> => {
    const response = await window.api.searchItems(searchTerm, 10)
    return response
}

export const fetchItem = async (id: number): Promise<Item | null> => {
    const response = await window.api.getItem(id)
    return response
}

// item note

export const updateItemNote = async (itemId: number, note: string): Promise<void> => {
    await window.api.setItemNote(itemId, note)
}

export const fetchItemNote = async (itemId: number): Promise<string> => {
    const result = await window.api.getItemNote(itemId)
    return result?.note || ''
}

export const fetchAllItemNotes = async (): Promise<ItemNote[]> => {
    return await window.api.getAllItemNotes()
}

export const deleteItemNote = async (itemId: number): Promise<void> => {
    await window.api.deleteItemNote(itemId)
}

// chars with items

export const fetchCharactersWithItem = async (itemId: number): Promise<CharacterWithGears[]> => {
    return await window.api.getCharactersWithItem(itemId)
}
