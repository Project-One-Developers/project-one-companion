import { formaUnixTimestampToItalianDate, getUnixTimestamp } from '@shared/libs/date/date-utils'
import {
    addCharacterRaiderio,
    deleteAllCharacterRaiderio,
    getLastTimeSyncedRaiderio
} from '@storage/players/characters-raiderio.storage'

import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { getCharactersList } from '@storage/players/characters.storage'
import { fetchCharacterRaidProgress, parseRaiderioData } from './characters-raiderio.utils'

export const syncCharacterRaiderio = async (): Promise<void> => {
    console.log('[Raiderio] Start Sync')

    const roster = await getCharactersList()

    const results: CharacterRaiderio[] = await Promise.all(
        roster.map(character =>
            fetchCharacterRaidProgress(character.name, character.realm).then(raiderioData => {
                return parseRaiderioData(character.name, character.realm, raiderioData)
            })
        )
    ).catch(error => {
        console.error('Error fetching Raider.io data:', error)
        throw error
    })

    await deleteAllCharacterRaiderio()
    await addCharacterRaiderio(results)

    console.log('[Raiderio] End Sync')
}

export const checkRaiderioUpdates = async (): Promise<void> => {
    console.log('checkRaiderioUpdates: checking..')
    const lastSync = await getLastTimeSyncedRaiderio()
    const oneHourUnixTs = 1 * 60 * 60

    if (lastSync === null || getUnixTimestamp() - lastSync > oneHourUnixTs) {
        console.log(
            'checkRaiderioUpdates: raiderio older than 1 hours (' +
                (lastSync != null ? formaUnixTimestampToItalianDate(lastSync) : '') +
                ') - syncing now'
        )
        await syncCharacterRaiderio()
    } else {
        console.log(
            'checkRaiderioUpdates: raiderio is up to date (' +
                formaUnixTimestampToItalianDate(lastSync) +
                ')'
        )
    }
}
