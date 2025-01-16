import { AppSettings } from '@shared/types/types'
import { reloadConnection } from '@storage/storage.config'
import { store } from '../../app/store'

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
