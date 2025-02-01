import { bossSchema, bossWithItemsSchema } from '@shared/schemas/boss.schema'
import { Boss, BossWithItems } from '@shared/types/types'
import { bossTable } from '@storage/storage.schema'
import { conflictUpdateAllExcept } from '@storage/storage.utils'
import { z } from 'zod'
import { db } from '../storage.config'

export const upsertBosses = async (bosses: Boss[]): Promise<void> => {
    await db
        .insert(bossTable)
        .values(bosses)
        .onConflictDoUpdate({
            target: bossTable.id,
            set: conflictUpdateAllExcept(bossTable, ['id'])
        })
}

export const getRaidLootTable = async (raidId: number): Promise<BossWithItems[]> => {
    const result = await db.query.bossTable.findMany({
        where: (bossTable, { eq }) => {
            return eq(bossTable.instanceId, raidId)
        },
        with: {
            items: true
        }
    })
    return z.array(bossWithItemsSchema).parse(result)
}

export const getBosses = async (raidId: number): Promise<Boss[]> => {
    const result = await db.query.bossTable.findMany({
        where: (bossTable, { eq }) => {
            return eq(bossTable.instanceId, raidId)
        }
    })
    return z.array(bossSchema).parse(result)
}
