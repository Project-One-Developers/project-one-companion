import { CharacterWithProgression } from '@shared/types/types'
import { getAllCharacterRaiderio } from '@storage/players/characters-raiderio.storage'
import { getCharactersList } from '@storage/players/characters.storage'

export const fetchRosterProgressionHandler = async (
    filter: number = 0
): Promise<CharacterWithProgression[]> => {
    const roster = await getCharactersList()
    console.log(`Fetching roster progression for ${roster.length} characters`)

    // Apply filter based on the parameter
    const filteredRoster = (() => {
        switch (filter) {
            case 1: // only mains
                return roster.filter(c => c.main)
            case 2: // only alts
                return roster.filter(c => !c.main)
            default: // no filter, get progress for all characters
                return roster
        }
    })()

    console.log(`After filtering: ${filteredRoster.length} characters (filter: ${filter})`)

    const allRaiderio = await getAllCharacterRaiderio()

    return filteredRoster.map(character => {
        // Find matching raiderio data based on name and realm
        const matchingRaiderio = allRaiderio.find(
            raiderio => raiderio.name === character.name && raiderio.realm === character.realm
        )

        return {
            p1Character: character,
            raiderIo: matchingRaiderio || null
        }
    })
}
