import { characterSchema, playerSchema } from '@shared/schemas/characters.schemas'
import type {
    Character,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    Player
} from '@shared/types/types'
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

export const getCharacterById = async (id: string): Promise<Character | null> => {
    const result = await db
        .select()
        .from(charTable)
        .where(eq(charTable.id, id))
        .then(takeFirstResult)

    if (!result) {
        return null
    }

    return characterSchema.parse(result)
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

export const addCharacter = async (character: NewCharacter): Promise<Player> => {
    const player =
        (await getPlayerByName(character.playerName)) ?? (await addPlayer(character.playerName))

    const id = newUUID()

    const result = await db
        .insert(charTable)
        .values({
            id,
            name: character.name,
            realm: character.realm,
            class: character.class,
            role: character.role,
            main: character.main,
            playerId: player.id
        })
        .returning()
        .then(takeFirstResult)

    return playerSchema.parse({
        id,
        name: player.name,
        characters: [
            {
                id,
                name: result?.name,
                realm: result?.realm,
                class: result?.class,
                role: result?.role,
                main: result?.main,
                playerId: player.id
            }
        ]
    })
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

export const editCharacter = async (edited: EditCharacter): Promise<void> => {
    await db
        .update(charTable)
        .set({
            name: edited.name,
            realm: edited.realm,
            class: edited.class,
            role: edited.role,
            main: edited.main
        })
        .where(eq(charTable.id, edited.id))
}

export const deletePlayer = async (id: string): Promise<void> => {
    await db.delete(charTable).where(eq(charTable.playerId, id))
    await db.delete(playerTable).where(eq(playerTable.id, id))
}

export const deleteCharacter = async (id: string): Promise<void> => {
    await db.delete(charTable).where(eq(charTable.id, id))
}
