import { eq } from 'drizzle-orm'
import { match } from 'ts-pattern'
import { Boss } from '../../../../../shared/types'
import { db } from '../storage.config'
import { bossTable } from '../storage.schema'

export const upsertBosses = async (bosses: Boss[]): Promise<void> => {
    const bossesInDb = await db.query.bossTable.findMany()

    const upserts = bosses.map((boss) => {
        const isBossInDb = bossesInDb.find((b) => b.id === boss.id)

        return match(isBossInDb)
            .with(undefined, () => db.insert(bossTable).values(boss))
            .otherwise(() => db.update(bossTable).set(boss).where(eq(bossTable.id, boss.id)))
    })

    await Promise.all(upserts)
}
