import { playerSchema } from '@shared/schemas/characters.schemas'
import type { EditPlayer, NewPlayer, Player, PlayerWithCharacters } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { charTable, playerTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq, isNull } from 'drizzle-orm'
import z from 'zod'
import { newUUID } from '../../utils'
import { playersListStorageSchema } from './players.schemas'

export const getPlayerWithCharactersList = async (): Promise<PlayerWithCharacters[]> => {
    const result = await db().query.playerTable.findMany({
        with: {
            characters: true
        }
    })
    return playersListStorageSchema.parse(result)
}

export const getPlayersWithoutCharactersList = async (): Promise<Player[]> => {
    const result = await db()
        .select()
        .from(playerTable)
        .leftJoin(charTable, eq(playerTable.id, charTable.playerId))
        .where(isNull(charTable.playerId))
    return z.array(playerSchema).parse(result.map(row => row.players))
}

export const getPlayerById = async (id: string): Promise<Player | null> => {
    const result = await db()
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, id))
        .then(takeFirstResult)

    if (!result) {
        return null
    }

    return playerSchema.parse(result)
}

export const addPlayer = async (player: NewPlayer): Promise<string> => {
    const id = newUUID()

    await db().insert(playerTable).values({
        id: id,
        name: player.name
    })

    return id
}

export const editPlayer = async (edited: EditPlayer): Promise<void> => {
    await db()
        .update(playerTable)
        .set({
            name: edited.name
        })
        .where(eq(playerTable.id, edited.id))
}

export const deletePlayer = async (id: string): Promise<void> => {
    await db().delete(charTable).where(eq(charTable.playerId, id))
    await db().delete(playerTable).where(eq(playerTable.id, id))
}
