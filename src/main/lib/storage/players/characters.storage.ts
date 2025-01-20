import { characterSchema, playerSchema } from '@shared/schemas/characters.schemas'
import type {
    Character,
    EditCharacter,
    NewCharacter,
    NewCharacterWowAudit,
    Player
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import { charTable, charWowAuditTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq } from 'drizzle-orm'
import { newUUID } from '../../utils'
import { addPlayer, getPlayerByName } from './players.storage'

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

export const addCharacterWowAudit = async (characters: NewCharacterWowAudit[]): Promise<void> => {
    await db.insert(charWowAuditTable).values(characters)
}

export const deleteAllCharacterWowAudit = async (): Promise<void> => {
    await db.delete(charWowAuditTable)
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

export const deleteCharacter = async (id: string): Promise<void> => {
    await db.delete(charTable).where(eq(charTable.id, id))
}
