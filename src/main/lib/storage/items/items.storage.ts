import { eq } from 'drizzle-orm'
import { match } from 'ts-pattern'
import { Item, ItemToTierset } from '../../../../../shared/types/types'
import { db } from '../storage.config'
import { itemTable, itemToTiersetTable } from '../storage.schema'

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

export const upsertItemsToTierset = async (itemsToTierset: ItemToTierset[]): Promise<void> => {
    await db.delete(itemToTiersetTable)
    await db.insert(itemToTiersetTable).values(itemsToTierset)
}
