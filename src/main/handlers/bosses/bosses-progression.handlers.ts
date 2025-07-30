
import {
    CharacterBossProgressionResponse,
    RaiderioCharacterResponse,
    raiderioCharacterResponseSchema
} from '@shared/schemas/raiderio.schemas'
import { getCharactersList } from '@storage/players/characters.storage'

export const fetchRosterProgressionHandler = async (): Promise<
    CharacterBossProgressionResponse[]
> => {
    const roster = await getCharactersList()
    console.log(`Fetching roster progression for ${roster.length} characters`)

    const { default: pLimit } = await import('p-limit')
    const limit = pLimit(3)

    const results = await Promise.allSettled(
        roster
            .filter(c => c.playerId == '1ec6b98f-e73f-49ca-b83b-fab1046ff619')
            .map(character =>
                limit(() =>
                    fetchCharacterRaidProgress(character.name, character.realm)
                        .then(raiderioData => ({
                            ...raiderioData,
                            character: character
                        }))
                )
            )
    )

    // Log failed requests for debugging
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            const character = roster[index]
            console.error(`Failed to fetch progression for ${character.name}:`, result.reason)
        }
    })

    const res = results
        .filter(
            (result): result is PromiseFulfilledResult<CharacterBossProgressionResponse> =>
                result.status === 'fulfilled'
        )
        .map(result => result.value)

    return res
}

async function fetchCharacterRaidProgress(
    characterName: string,
    realm: string
): Promise<RaiderioCharacterResponse> {
    const url = `https://raider.io/api/characters/eu/${realm}/${characterName}?season=season-tww-2&tier=33`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${characterName} from ${realm}: ${response.status} ${response.statusText}`
        )
    }

    const data = await response.json()

    try {
        return raiderioCharacterResponseSchema.parse(data)
    } catch (parseError) {
        throw new Error(`Invalid data format for ${characterName}: ${parseError}`)
    }
}
