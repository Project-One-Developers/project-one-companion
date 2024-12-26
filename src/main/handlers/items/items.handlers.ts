import { upsertItems } from '../../lib/storage/items/items.storage'

import { upsertBosses } from '../../lib/storage/boss/boss.storage'
import { fetchRaidBosses, fetchRaidItems } from './items.utils'

export const reloadItemsHandler = async (): Promise<void> => {
    console.log('Reloading resources/items.csv')

    const [raidItems, raidBosses] = await Promise.all([
        await fetchRaidItems(),
        await fetchRaidBosses()
    ])

    // upsert bosses
    await upsertBosses(raidBosses)

    // upsert items
    await upsertItems(raidItems)
}
