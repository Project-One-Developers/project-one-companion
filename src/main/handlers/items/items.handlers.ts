import { upsertBosses } from '@storage/boss/boss.storage'
import {
    upsertItems,
    upsertItemsToCatalyst,
    upsertItemsToTierset
} from '@storage/items/items.storage'
import {
    fetchItemsToCatalyst,
    fetchItemsToTierset,
    fetchRaidBosses,
    fetchRaidItems
} from './items.utils'

export const reloadItemsHandler = async (): Promise<void> => {
    console.log('Reloading resources/wow/*.json')

    const raidItems = fetchRaidItems()
    const raidBosses = fetchRaidBosses()
    const raidItemsToTierset = fetchItemsToTierset()
    const raidItemsToCatalyst = fetchItemsToCatalyst()

    // non rendere concorrente: i value hanno relazioni
    await upsertBosses(raidBosses)
    await upsertItems(raidItems)
    await upsertItemsToTierset(raidItemsToTierset)
    await upsertItemsToCatalyst(raidItemsToCatalyst)
}
