import { eq } from 'drizzle-orm'
import { match } from 'ts-pattern'
import { Item } from '../../../../../shared/types/types'
import { db } from '../storage.config'
import { itemTable } from '../storage.schema'

export const upsertItems = async (items: Item[]): Promise<void> => {
    const itemsInDb = await db.query.itemTable.findMany()

    const upserts = items.map((item) => {
        const isItemInDb = itemsInDb.find((i) => i.id === item.id)

        return match(isItemInDb)
            .with(undefined, () => db.insert(itemTable).values(item))
            .otherwise(() => db.update(itemTable).set(item).where(eq(itemTable.id, item.id)))
    })

    await Promise.all(upserts)
}
