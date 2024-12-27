import { upsertBosses } from '../../lib/storage/boss/boss.storage'
import { upsertItems, upsertItemsToTierset } from '../../lib/storage/items/items.storage'
import { fetchItemsToTierset, fetchRaidBosses, fetchRaidItems } from './items.utils'

export const reloadItemsHandler = async (): Promise<void> => {
    console.log('Reloading resources/items.csv')

    const raidItems = fetchRaidItems()
    const raidBosses = fetchRaidBosses()
    const raidItemsToTierset = fetchItemsToTierset()

    await Promise.all([
        upsertItems(raidItems),
        upsertBosses(raidBosses),
        upsertItemsToTierset(raidItemsToTierset)
    ])
}
