import { eq } from 'drizzle-orm'
import { Item } from '../../../../../shared/types'
import { db } from '../storage.config'
import { itemTable } from '../storage.schema'

export const upsertItems = async (items: Item[]): Promise<null> => {
    for await (const i of items) {
        const res = await db.select().from(itemTable).where(eq(itemTable.id, i.id)) // todo: ricavarli tutti in memoria senza fare ogni volta la query
        if (res.length === 0) {
            // insert item
            await db.insert(itemTable).values(i)
        } else {
            // update item
            await db.update(itemTable).set(i).where(eq(itemTable.id, i.id))
        }
    }
    return null
}
