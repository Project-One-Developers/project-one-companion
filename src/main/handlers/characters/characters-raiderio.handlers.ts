import { formaUnixTimestampToItalianDate, getUnixTimestamp } from '@shared/libs/date/date-utils'
import {
    addCharacterRaiderio,
    deleteAllCharacterRaiderio,
    getLastTimeSyncedRaiderio,
    upsertCharacterRaiderio
} from '@storage/players/characters-raiderio.storage'

import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { getCharactersList } from '@storage/players/characters.storage'
import { fetchCharacterRaidProgress, parseRaiderioData } from './characters-raiderio.utils'

export const syncAllCharactersRaiderio = async (): Promise<void> => {
    console.log('[Raiderio] Start Full Sync')

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

    console.log('[Raiderio] Full Sync Completed')
}

export const syncCharacterRaiderio = async (
    characterName: string,
    characterRealm: string
): Promise<void> => {
    console.log(`[Raiderio] Start Single Character Sync: ${characterName} - ${characterRealm}`)

    const raiderioData = await fetchCharacterRaidProgress(characterName, characterRealm)
    const result: CharacterRaiderio = await parseRaiderioData(
        characterName,
        characterRealm,
        raiderioData
    )

    await upsertCharacterRaiderio([result])

    console.log(`[Raiderio] Single Character Sync Completed: ${characterName} - ${characterRealm}`)
}

export const checkRaiderioUpdates = async (): Promise<void> => {
    console.log('checkRaiderioUpdates: checking..')
    const lastSync = await getLastTimeSyncedRaiderio()
    const frequencyTS = 1 * 60 * 60 // 1 hours in seconds

    if (lastSync === null || getUnixTimestamp() - lastSync > frequencyTS) {
        console.log(
            'checkRaiderioUpdates: raiderio needs to be updated (' +
                (lastSync != null ? formaUnixTimestampToItalianDate(lastSync) : '') +
                ') - syncing now'
        )
        await syncAllCharactersRaiderio()
    } else {
        console.log(
            'checkRaiderioUpdates: raiderio is up to date (' +
                formaUnixTimestampToItalianDate(lastSync) +
                ')'
        )
    }
}
