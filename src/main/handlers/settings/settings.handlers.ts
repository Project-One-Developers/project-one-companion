import { AppSettings } from '@shared/types/types'
import { upsertBosses } from '@storage/bosses/bosses.storage'
import {
    invalidateCache,
    upsertItems,
    upsertItemsToCatalyst,
    upsertItemsToTierset
} from '@storage/items/items.storage'
import { reloadConnection } from '@storage/storage.config'
import { store } from '../../app/store'
import {
    fetchItemsToCatalyst,
    fetchItemsToTierset,
    fetchNonRaidItems,
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
    await reloadConnection()
}

export const resetAppSettingsHandler = async (): Promise<void> => {
    store.factoryReset()

    // reload db connection
    await reloadConnection()
}

export const upsertJsonDataHandler = async (): Promise<void> => {
    console.log('Reloading resources/wow/*.json')

    await upsertSeason(1)
    await upsertSeason(2)
    await upsertSeason(3)

    // es: Cyrcle's Circlet
    const nonRaidItems = fetchNonRaidItems()
    await upsertItems(nonRaidItems)
}

const upsertSeason = async (season: number): Promise<void> => {
    const raidItems = fetchRaidItems(season)
    const raidBosses = fetchRaidBosses(season)
    const raidItemsToTierset = fetchItemsToTierset(season)
    const raidItemsToCatalyst = fetchItemsToCatalyst(season)

    // non rendere concorrente: i value hanno relazioni
    await upsertBosses(raidBosses)
    await upsertItems(raidItems)
    await upsertItemsToTierset(raidItemsToTierset)
    await upsertItemsToCatalyst(raidItemsToCatalyst)

    // invalidate items in cache
    invalidateCache()
}
