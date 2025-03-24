import { BisList } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { bisListTable } from '@storage/storage.schema'
import { newUUID } from '@utils'
import { eq, sql } from 'drizzle-orm'

export const getBisList = async (): Promise<BisList[]> => {
    const results = await db()
        .select({
            itemId: bisListTable.itemId,
            specIds: sql<number[]>`array_agg(${bisListTable.specId})`
        })
        .from(bisListTable)
        .groupBy(bisListTable.itemId)

    return results
}

export const updateItemBisSpec = async (itemId: number, specIds: number[]): Promise<void> => {
    await db().delete(bisListTable).where(eq(bisListTable.itemId, itemId))

    if (specIds.length > 0) {
        const values = specIds.map(spec => ({
            id: newUUID(),
            specId: spec,
            itemId: itemId
        }))

        await db().insert(bisListTable).values(values)
    }
}
