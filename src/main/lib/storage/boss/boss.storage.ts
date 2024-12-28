import { Boss } from '../../../../../shared/types/types'
import { db } from '../storage.config'
import { bossTable } from '../storage.schema'
import { conflictUpdateAllExcept } from '../storage.utils'

export const upsertBosses = async (bosses: Boss[]): Promise<void> => {
    await db
        .insert(bossTable)
        .values(bosses)
        .onConflictDoUpdate({
            target: bossTable.id,
            set: conflictUpdateAllExcept(bossTable, ['id'])
        })
}
