import type { Boss } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { bossTable } from '@storage/storage.schema'
import { conflictUpdateAllExcept } from '@storage/storage.utils'

export const upsertBosses = async (bosses: Boss[]): Promise<void> => {
    await db
        .insert(bossTable)
        .values(bosses)
        .onConflictDoUpdate({
            target: bossTable.id,
            set: conflictUpdateAllExcept(bossTable, ['id'])
        })
}
