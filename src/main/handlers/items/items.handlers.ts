import { upsertItems } from '../../lib/storage/items/items.storage'

import { upsertBosses } from '../../lib/storage/boss/boss.storage'
import { fetchRaidBosses, fetchRaidItems } from './items.utils'

export const reloadItemsHandler = async (): Promise<void> => {
    console.log('Reloading resources/items.csv')

    const raidItems = fetchRaidItems()
    const raidBosses = fetchRaidBosses()

    await Promise.all([upsertItems(raidItems), upsertBosses(raidBosses)])
}
