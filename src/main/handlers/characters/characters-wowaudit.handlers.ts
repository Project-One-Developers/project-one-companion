import { formaUnixTimestampToItalianDate, getUnixTimestamp } from '@shared/libs/date/date-utils'
import {
    addCharacterWowAudit,
    deleteAllCharacterWowAudit,
    getLastTimeSyncedWowAudit
} from '@storage/players/characters-wowaudit.storage'
import { getConfig } from '@storage/settings/settings.storage'
import { fetchWowAuditData, parseWowAuditData } from './characters.utils'

export const syncCharacterWowAudit = async (): Promise<void> => {
    const key = await getConfig('WOW_AUDIT_API_KEY')

    if (key === null) {
        throw new Error('WOW_AUDIT_API_KEY not set in database')
    }

    console.log('[WowAudit] Start Sync')

    const json = await fetchWowAuditData(key)

    if (json != null) {
        const charsData = await parseWowAuditData(json)
        await deleteAllCharacterWowAudit()
        await addCharacterWowAudit(charsData)
    }
    console.log('[WowAudit] End Sync')
}

export const checkWowAuditUpdates = async (): Promise<void> => {
    console.log('checkWowAuditUpdates: checking..')
    const lastSync = await getLastTimeSyncedWowAudit()
    const fourHoursUnixTs = 4 * 60 * 60

    if (lastSync === null || getUnixTimestamp() - lastSync > fourHoursUnixTs) {
        console.log(
            'checkWowAuditUpdates: woaudit older than 4 hours (' +
                (lastSync != null ? formaUnixTimestampToItalianDate(lastSync) : '') +
                ') - syncing now'
        )
        await syncCharacterWowAudit()
    } else {
        console.log(
            'checkWowAuditUpdates: woaudit is up to date (' +
                formaUnixTimestampToItalianDate(lastSync) +
                ')'
        )
    }
}
