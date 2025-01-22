import { AppSettings } from '@shared/types/types'
import { upsertBosses } from '@storage/bosses/bosses.storage'
import {
    upsertItems,
    upsertItemsToCatalyst,
    upsertItemsToTierset
} from '@storage/items/items.storage'
import { reloadConnection } from '@storage/storage.config'
import { store } from '../../app/store'
import {
    fetchItemsToCatalyst,
    fetchItemsToTierset,
    fetchRaidBosses,
    fetchRaidItems
} from './settings.utils'

export const getAppSettingsHandler = async (): Promise<AppSettings> => {
    return {
        databaseUrl: store.getDatabaseUrl()
    }
}

export const setAppSettingsHandler = async (settings: AppSettings): Promise<void> => {
    // save in electron store
    store.setDatabaseUrl(settings.databaseUrl)

    // reload db connection
    reloadConnection()
}

export const resetAppSettingsHandler = async (): Promise<void> => {
    store.factoryReset()

    // reload db connection
    reloadConnection()
}

export const upsertJsonDataHandler = async (): Promise<void> => {
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
