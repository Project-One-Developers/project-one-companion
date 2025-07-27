import { itemNoteSchema } from '@shared/schemas/itemNote.schema'
import type { ItemNote } from '@shared/types/types'
import { eq } from 'drizzle-orm'
import { db } from '../storage.config'
import { itemNoteTable } from '../storage.schema'
import { conflictUpdateAllExcept } from '../storage.utils'

export const getItemNote = async (id: number): Promise<ItemNote | null> => {
    const res = await db().query.itemNoteTable.findFirst({
        where: (itemNoteTable, { eq }) => eq(itemNoteTable.itemId, id)
    })

    return res ? itemNoteSchema.parse(res) : null
}

export const setItemNote = async (id: number, note: string): Promise<ItemNote> => {
    const [res] = await db()
        .insert(itemNoteTable)
        .values({ itemId: id, note })
        .onConflictDoUpdate({
            target: itemNoteTable.itemId,
            set: conflictUpdateAllExcept(itemNoteTable, ['itemId'])
        })
        .returning()

    return itemNoteSchema.parse(res)
}

export const deleteItemNote = async (id: number): Promise<void> => {
    await db().delete(itemNoteTable).where(eq(itemNoteTable.itemId, id))
}
