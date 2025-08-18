import { simcSchema } from '@shared/schemas/simulations.schemas'
import type { SimC } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { simcTable } from '@storage/storage.schema'
import { conflictUpdateAllExcept } from '@storage/storage.utils'
import z from 'zod'

export const addSimC = async (simc: SimC): Promise<void> => {
    await db()
        .insert(simcTable)
        .values(simc)
        .onConflictDoUpdate({
            target: [simcTable.charName, simcTable.charRealm], // composite primary key
            set: conflictUpdateAllExcept(simcTable, ['charName', 'charRealm'])
        })
}

export const getAllSimC = async (): Promise<SimC[]> => {
    const result = await db().query.simcTable.findMany()
    return z.array(simcSchema).parse(result)
}
