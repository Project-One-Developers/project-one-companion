import { bossSchema } from '@shared/schemas/wow.schemas'
import type { Boss } from '@shared/types/types'
import { bossTable } from '@storage/storage.schema'
import { conflictUpdateAllExcept } from '@storage/storage.utils'
import { z } from 'zod'
import { db } from '../storage.config'
import { NewBoss } from './bosses.types.'

export const upsertBosses = async (bosses: NewBoss[]): Promise<void> => {
    await db
        .insert(bossTable)
        .values(bosses)
        .onConflictDoUpdate({
            target: bossTable.id,
            set: conflictUpdateAllExcept(bossTable, ['id'])
        })
}

export const getRaidLootTable = async (raidId: number): Promise<Boss[]> => {
    const result = await db.query.bossTable.findMany({
        where: (bossTable, { eq }) => {
            return eq(bossTable.raidId, raidId)
        },
        with: {
            items: true
        }
    })
    return z.array(bossSchema).parse(result)
}
