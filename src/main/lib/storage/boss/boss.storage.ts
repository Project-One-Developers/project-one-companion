import { eq } from 'drizzle-orm'
import { Boss } from '../../../../../shared/types'
import { db } from '../storage.config'
import { bossTable } from '../storage.schema'

export const upsertBosses = async (bosses: Boss[]): Promise<null> => {
    for await (const b of bosses) {
        const res = await db.select().from(bossTable).where(eq(bossTable.id, b.id)) // todo: ricavarli tutti in memoria senza fare ogni volta la query
        if (res.length === 0) {
            // insert boss
            await db.insert(bossTable).values(b)
        } else {
            // update boss
            await db.update(bossTable).set(b).where(eq(bossTable.id, b.id))
        }
    }
    return null
}
