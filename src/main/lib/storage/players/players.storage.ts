import { eq } from 'drizzle-orm'
import { playerSchema } from '../../../../../shared/schemas'
import { NewCharacter, Player } from '../../../../../shared/types'
import { isPresent, newUUID } from '../../utils'
import { db } from '../storage.config'
import { charTable, playerTable } from '../storage.schema'
import { parseAndValidate, takeFirstResult } from '../storage.utils'

export const getPlayerById = async (playerId: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, playerId))
        .then(takeFirstResult)

    return parseAndValidate(playerSchema, result)
}

export const getPlayerByName = async (playerName: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.name, playerName))
        .then(takeFirstResult)

    return parseAndValidate(playerSchema, result)
}

export const addCharacter = async (character: NewCharacter): Promise<Player | null> => {
    const player =
        (await getPlayerByName(character.playerName)) ?? (await addPlayer(character.playerName))

    if (!isPresent(player)) {
        console.log('Failed to creating or finding player')
        return null
    }

    const result = await db
        .insert(charTable)
        .values({
            id: newUUID(),
            name: character.characterName,
            class: character.class,
            role: character.role,
            playerId: player.id
        })
        .returning()
        .execute()
        .then(takeFirstResult)

    return parseAndValidate(playerSchema, result)
}

const addPlayer = async (playerName: string): Promise<Player | null> => {
    const result = await db
        .insert(playerTable)
        .values({
            id: newUUID(),
            name: playerName
        })
        .returning()
        .execute()
        .then(takeFirstResult)

    return parseAndValidate(playerSchema, result)
}
