import type { ItemNote } from '@shared/types/types'

import { deleteItemNote, getItemNote, setItemNote } from '@storage/items/itemsNote.storage'
import { getAllItemNotes } from '../../lib/storage/items/itemsNote.storage'

export const getAllItemNotesHandler = async (): Promise<ItemNote[]> => {
    return await getAllItemNotes()
}

export const getItemNoteHandler = async (id: number): Promise<ItemNote | null> => {
    return await getItemNote(id)
}

export const setItemNoteHandler = async (id: number, note: string): Promise<ItemNote> => {
    return await setItemNote(id, note)
}

export const deleteItemNoteHandler = async (id: number): Promise<void> => {
    return await deleteItemNote(id)
}
