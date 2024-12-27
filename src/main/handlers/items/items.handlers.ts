import { upsertBosses } from '../../lib/storage/boss/boss.storage'
import { upsertItems, upsertItemsToTierset } from '../../lib/storage/items/items.storage'
import { fetchItemsToTierset, fetchRaidBosses, fetchRaidItems } from './items.utils'

export const reloadItemsHandler = async (): Promise<void> => {
    console.log('Reloading resources/items.csv')

    const raidItems = fetchRaidItems()
    const raidBosses = fetchRaidBosses()
    const raidItemsToTierset = fetchItemsToTierset()

    // non rendere concorrente: i value hanno relazioni
    await upsertBosses(raidBosses)
    await upsertItems(raidItems)
    await upsertItemsToTierset(raidItemsToTierset)
}
