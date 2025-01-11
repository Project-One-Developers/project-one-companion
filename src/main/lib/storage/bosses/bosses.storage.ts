import { bossSchema } from '@shared/schemas/wow.schemas'
import type { Boss, NewBoss } from '@shared/types/types'
import { bossTable } from '@storage/storage.schema'
import { conflictUpdateAllExcept } from '@storage/storage.utils'
import { z } from 'zod'
import { db } from '../storage.config'
import { bossOverviewSchema } from './bosses.schemas'
import { BossOverview } from './bosses.types.'

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

export const getBossesNames = async (): Promise<BossOverview[]> => {
    const result = await db.query.bossTable.findMany({
        columns: { id: true, name: true }
    })

    return z.array(bossOverviewSchema).parse(result)
}
