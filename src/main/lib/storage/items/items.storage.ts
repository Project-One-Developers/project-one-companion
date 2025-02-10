import { CURRENT_RAID_ID, CURRENT_SEASON } from '@shared/consts/wow.consts'
import { itemSchema } from '@shared/schemas/items.schema'
import type { Item, ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../storage.config'
import { itemTable, itemToCatalystTable, itemToTiersetTable } from '../storage.schema'
import { conflictUpdateAllExcept } from '../storage.utils'

export const getItems = async (): Promise<Item[]> => {
    const items = await db.query.itemTable.findMany()
    return z.array(itemSchema).parse(items)
}

export const getItem = async (id: number): Promise<Item | null> => {
    const res = await db.query.itemTable.findFirst({
        where: (itemTable, { eq }) => eq(itemTable.id, id)
    })

    if (!res) {
        return null
    }

    return itemSchema.parse(res)
}

export const getItemByIds = async (ids: number[]): Promise<Item[]> => {
    const res = await db.query.itemTable.findFirst({
        where: (itemTable, { inArray }) => inArray(itemTable.id, ids)
    })
    return z.array(itemSchema).parse(res)
}

/**
 * Todo: it should returns the only the list of item from current season
 * @returns
 */
export const getTiersetAndTokenList = async (): Promise<Item[]> => {
    const res = await db.query.itemTable.findMany({
        where: (itemTable, { inArray, eq, or, and }) =>
            and(
                inArray(itemTable.sourceId, [CURRENT_RAID_ID, CURRENT_SEASON]),
                or(eq(itemTable.tierset, true), eq(itemTable.token, true))
            )
    })
    return z.array(itemSchema).parse(res)
}

export const searchItems = async (searchTerm: string, limit: number): Promise<Item[]> => {
    const res = await db
        .select()
        .from(itemTable)
        .where(ilike(itemTable.name, '%' + searchTerm + '%'))
        .limit(limit)
    return z.array(itemSchema).parse(res)
}

export const upsertItems = async (items: Item[]): Promise<void> => {
    await db
        .insert(itemTable)
        .values(items)
        .onConflictDoUpdate({
            target: itemTable.id,
            set: conflictUpdateAllExcept(itemTable, ['id'])
        })
}

export const upsertItemsToTierset = async (itemsToTierset: ItemToTierset[]): Promise<void> => {
    await db.delete(itemToTiersetTable)
    await db.insert(itemToTiersetTable).values(itemsToTierset)
}

export const upsertItemsToCatalyst = async (itemsToTierset: ItemToCatalyst[]): Promise<void> => {
    await db.delete(itemToCatalystTable)
    await db.insert(itemToCatalystTable).values(itemsToTierset)
}
