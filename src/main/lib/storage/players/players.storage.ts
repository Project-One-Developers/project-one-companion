import { playerSchema } from '@shared/schemas/characters.schemas'
import type { EditPlayer, Player } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { charTable, playerTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq } from 'drizzle-orm'
import { newUUID } from '../../utils'
import { playersListStorageSchema } from './players.schemas'

export const getPlayerWithCharactersList = async (): Promise<Player[]> => {
    const result = await db.query.playerTable.findMany({
        with: {
            chars: true
        }
    })
    return playersListStorageSchema.parse(result)
}

export const getPlayerById = async (id: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, id))
        .then(takeFirstResult)

    if (!result) {
        return null
    }

    return playerSchema.parse(result)
}

export const getPlayerByName = async (playerName: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.name, playerName))
        .then(takeFirstResult)

    if (!result) {
        return null
    }

    return playerSchema.parse({ id: result.id, name: result.name })
}

export const addPlayer = async (playerName: string): Promise<Player> => {
    const id = newUUID()

    const result = await db
        .insert(playerTable)
        .values({
            id: id,
            name: playerName
        })
        .returning()
        .then(takeFirstResult)

    return playerSchema.parse({
        id,
        name: result?.name
    })
}

export const editPlayer = async (edited: EditPlayer): Promise<void> => {
    await db
        .update(playerTable)
        .set({
            name: edited.name
        })
        .where(eq(playerTable.id, edited.id))
}

export const deletePlayer = async (id: string): Promise<void> => {
    await db.delete(charTable).where(eq(charTable.playerId, id))
    await db.delete(playerTable).where(eq(playerTable.id, id))
}
