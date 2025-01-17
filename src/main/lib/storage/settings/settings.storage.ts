import { appConfigTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq } from 'drizzle-orm'
import { db } from '../storage.config'

export const getConfig = async (key: string): Promise<string | null> => {
    const result = await db
        .select()
        .from(appConfigTable)
        .where(eq(appConfigTable.key, key))
        .then(takeFirstResult)
    if (!result) {
        return null
    }
    return result.value
}
