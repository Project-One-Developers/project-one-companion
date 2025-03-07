import { CURRENT_SEASON } from '@shared/consts/wow.consts'
import {
    itemSchema,
    itemToCatalystArraySchema,
    itemToTiersetArraySchema
} from '@shared/schemas/items.schema'
import type { Item, ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { and, eq, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../storage.config'
import { itemTable, itemToCatalystTable, itemToTiersetTable } from '../storage.schema'
import { conflictUpdateAllExcept } from '../storage.utils'

// Static cache variables
let cachedItemsToTiersetMapping: ItemToTierset[] | null = null
let cachedItemsToCatalystMapping: ItemToCatalyst[] | null = null
let allItems: Item[] | null = null
let cachedTierset: Item[] | null = null

export const getItems = async (): Promise<Item[]> => {
    if (!allItems) {
        const items = await db().query.itemTable.findMany()
        allItems = z.array(itemSchema).parse(items)
    }
    return allItems
}

export const getItem = async (id: number): Promise<Item | null> => {
    const res = await db().query.itemTable.findFirst({
        where: (itemTable, { eq }) => eq(itemTable.id, id)
    })

    if (!res) {
        return null
    }

    return itemSchema.parse(res)
}

export const getItemByIds = async (ids: number[]): Promise<Item[]> => {
    const res = await db().query.itemTable.findFirst({
        where: (itemTable, { inArray }) => inArray(itemTable.id, ids)
    })
    return z.array(itemSchema).parse(res)
}

export const getItemToTiersetMapping = async (): Promise<ItemToTierset[]> => {
    if (!cachedItemsToTiersetMapping) {
        const result = await db().query.itemToTiersetTable.findMany()
        cachedItemsToTiersetMapping = itemToTiersetArraySchema.parse(result)
    }
    return cachedItemsToTiersetMapping
}
export const getItemToCatalystMapping = async (): Promise<ItemToCatalyst[]> => {
    if (!cachedItemsToCatalystMapping) {
        const result = await db().query.itemToCatalystTable.findMany()
        cachedItemsToCatalystMapping = itemToCatalystArraySchema.parse(result)
    }
    return cachedItemsToCatalystMapping
}

export const getTiersetAndTokenList = async (): Promise<Item[]> => {
    if (!cachedTierset) {
        const res = await db().query.itemTable.findMany({
            where: (itemTable, { eq, or, and }) =>
                and(
                    eq(itemTable.season, CURRENT_SEASON),
                    or(eq(itemTable.tierset, true), eq(itemTable.token, true))
                )
        })
        cachedTierset = z.array(itemSchema).parse(res)
    }
    return cachedTierset
}

export const searchItems = async (searchTerm: string, limit: number): Promise<Item[]> => {
    const res = await db()
        .select()
        .from(itemTable)
        .where(
            and(eq(itemTable.season, CURRENT_SEASON), ilike(itemTable.name, '%' + searchTerm + '%'))
        )
        .limit(limit)
    return z.array(itemSchema).parse(res)
}

export const upsertItems = async (items: Item[]): Promise<void> => {
    await db()
        .insert(itemTable)
        .values(items)
        .onConflictDoUpdate({
            target: itemTable.id,
            set: conflictUpdateAllExcept(itemTable, ['id'])
        })
}

export const deleteItemById = async (id: number): Promise<void> => {
    await db().delete(itemTable).where(eq(itemTable.id, id))
}

export const upsertItemsToTierset = async (itemsToTierset: ItemToTierset[]): Promise<void> => {
    await db().delete(itemToTiersetTable)
    await db().insert(itemToTiersetTable).values(itemsToTierset)
}

export const upsertItemsToCatalyst = async (itemsToTierset: ItemToCatalyst[]): Promise<void> => {
    await db().delete(itemToCatalystTable)
    await db().insert(itemToCatalystTable).values(itemsToTierset)
}

export const invalidateCache = (): void => {
    cachedItemsToTiersetMapping = null
    cachedItemsToCatalystMapping = null
    allItems = null
    cachedTierset = null
}
