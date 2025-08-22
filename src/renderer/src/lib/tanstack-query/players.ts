import type {
    Character,
    CharacterGameInfo,
    CharacterSummary,
    CharacterWithPlayer,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    NewPlayer,
    Player,
    PlayerWithCharacters
} from 'shared/types/types'

// characters

export const addCharacter = async (character: NewCharacter): Promise<Character> => {
    const response = await window.api.addCharacter(character)
    return response
}

export const fetchCharacter = async (id: string | undefined): Promise<CharacterWithPlayer> => {
    if (!id) {
        throw new Error('No raid session id provided')
    }
    return await window.api.getCharacter(id)
}

export const fetchCharacters = async (): Promise<Character[]> => {
    const response = await window.api.getCharactersList()
    return response
}

export const deleteCharacter = async (id: string): Promise<void> => {
    const response = await window.api.deleteCharacter(id)
    return response
}

export const editCharacter = async (edited: EditCharacter): Promise<Character> => {
    return await window.api.editCharacter(edited)
}

export const getCharacterGameInfo = async (
    charName: string,
    charRealm: string
): Promise<CharacterGameInfo> => {
    return await window.api.getCharacterGameInfo(charName, charRealm)
}

// Type definition for the enriched player
export type PlayerWithCharactersSummary = {
    id: string
    name: string
    charsSummary: CharacterSummary[]
}

export const fetchPlayers = async (): Promise<PlayerWithCharacters[]> => {
    return await window.api.getPlayerWithCharList()
}

export const fetchPlayersWithoutCharacters = async (): Promise<Player[]> => {
    return await window.api.getPlayerWithoutCharsList()
}

// Utility func to show player with chars cards
export const fetchPlayersSummary = async (): Promise<PlayerWithCharactersSummary[]> => {
    const [rosterSummary, playersWithoutChars] = await Promise.all([
        fetchRosterSummary(),
        fetchPlayersWithoutCharacters()
    ])

    // Transform roster summary to players with characters
    const playersWithCharacters: PlayerWithCharactersSummary[] =
        rosterSummary?.reduce((acc, charSummary) => {
            const player = charSummary.character.player

            // Find existing player in accumulator
            const existingPlayer = acc.find(p => p.id === player.id)

            if (existingPlayer) {
                // Add character summary to existing player
                existingPlayer.charsSummary.push(charSummary)
            } else {
                // Create new player with this character summary
                acc.push({
                    ...player,
                    charsSummary: [charSummary]
                })
            }

            return acc
        }, [] as PlayerWithCharactersSummary[]) ?? []

    // Transform players without characters to match the unified format
    const playersWithoutCharsFormatted = playersWithoutChars.map(player => ({
        ...player,
        charsSummary: [] as CharacterSummary[]
    }))

    // Combine both arrays, with players with characters first
    return [...playersWithCharacters, ...playersWithoutCharsFormatted]
}

export const addPlayer = async (player: NewPlayer): Promise<Player> => {
    return await window.api.addPlayer(player)
}

export const deletePlayer = async (id: string): Promise<void> => {
    return await window.api.deletePlayer(id)
}

export const editPlayer = async (edited: EditPlayer): Promise<Player> => {
    return await window.api.editPlayer(edited)
}

// roster

export const fetchRosterSummary = async (): Promise<CharacterSummary[]> => {
    return await window.api.getRosterSummary()
}
