import type { AppSettings } from 'shared/types/types'

export const fetchSettings = async (): Promise<AppSettings> => {
    return await window.api.getAppSettings()
}

export const editSettings = async (url: AppSettings): Promise<void> => {
    return await window.api.editAppSettings(url)
}
