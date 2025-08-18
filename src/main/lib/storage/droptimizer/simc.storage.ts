import type { SimC } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { simcTable } from '@storage/storage.schema'

export const addSimC = async (simc: SimC): Promise<void> => {
    await db().insert(simcTable).values(simc).onConflictDoNothing()
}
