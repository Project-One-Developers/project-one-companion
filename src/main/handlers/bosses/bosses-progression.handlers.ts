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

    const results = await Promise.allSettled(
        roster
            //.filter(c => c.playerId == '1ec6b98f-e73f-49ca-b83b-fab1046ff619')
            //.filter(c => c.main)
            .map(character =>
                fetchCharacterRaidProgress(character.name, character.realm).then(raiderioData => ({
                    ...raiderioData,
                    character: character
                }))
            )
    )

    // Log failed requests for debugging
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            const character = roster[index]
            console.log(
                {
                    error: result.reason,
                    character: {
                        name: character.name,
                        realm: character.realm,
                        playerId: character.playerId
                    }
                },
                `Failed to fetch progression for ${character.name}-${character.realm}`
            )
        }
    })

    const successfulResults = results
        .filter(
            (result): result is PromiseFulfilledResult<CharacterBossProgressionResponse> =>
                result.status === 'fulfilled'
        )
        .map(result => result.value)

    console.log(
        `Successfully fetched progression for ${successfulResults.length}/${roster.length} characters`
    )

    return successfulResults
}

async function fetchCharacterRaidProgress(
    characterName: string,
    realm: string
): Promise<RaiderioCharacterResponse> {
    const url = `https://raider.io/api/characters/eu/${realm}/${characterName}?season=season-tww-2&tier=33`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            const errorMessage = `Failed to fetch ${characterName} from ${realm}: ${response.status} ${response.statusText}`
            console.log(
                {
                    url,
                    character: characterName,
                    realm,
                    status: response.status,
                    statusText: response.statusText
                },
                errorMessage
            )

            throw new Error(errorMessage)
        }

        const data = await response.json()

        try {
            const validatedData = raiderioCharacterResponseSchema.parse(data)
            return validatedData
        } catch (parseError) {
            const errorMessage = `Invalid data format for ${characterName}-${realm}`
            console.log(
                {
                    url,
                    character: characterName,
                    realm,
                    parseError: parseError instanceof Error ? parseError.message : parseError,
                    receivedData: data
                },
                errorMessage
            )

            throw new Error(`${errorMessage}: ${parseError}`)
        }
    } catch (error) {
        // Re-throw with URL context if it's a network error or other unexpected error
        if (error instanceof Error && !error.message.includes('Failed to fetch')) {
            console.log(
                {
                    url,
                    character: characterName,
                    realm,
                    originalError: error.message
                },
                `Unexpected error while fetching character data for ${characterName}-${realm}`
            )

            throw new Error(
                `Network error for ${characterName}-${realm} (${url}): ${error.message}`
            )
        }

        // Re-throw the error as-is if it's already handled above
        throw error
    }
}
