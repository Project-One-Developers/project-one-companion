import { getClassSpec } from '@shared/libs/spec-parser/spec-parser'
import { bisListSchema } from '@shared/schemas/bis-list.schemas'
import { BisList } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { bisListTable } from '@storage/storage.schema'
import { newUUID } from '@utils'
import { and, eq, sql } from 'drizzle-orm'

export const getBisList = async (): Promise<BisList[]> => {
    const results = await db
        .select({
            specId: bisListTable.specId,
            itemIds: sql<number[]>`array_agg(${bisListTable.itemId})`
        })
        .from(bisListTable)
        .groupBy(bisListTable.specId)

    return results.map(({ specId, itemIds }) => {
        const { wowClass, wowSpec } = getClassSpec(specId)
        return bisListSchema.parse({
            wowClass,
            wowSpec,
            itemIds
        })
    })
}

export const assignBis = async (specId: number, itemId: number): Promise<void> => {
    await db.insert(bisListTable).values({ id: newUUID(), specId, itemId })
}

export const unassignBis = async (specId: number, itemId: number): Promise<void> => {
    await db
        .delete(bisListTable)
        .where(and(eq(bisListTable.specId, specId), eq(bisListTable.itemId, itemId)))
}
