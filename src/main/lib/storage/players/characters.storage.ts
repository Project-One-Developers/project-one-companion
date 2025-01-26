import { charactersListSchema, characterWithPlayerSchema } from '@shared/schemas/characters.schemas'
import type {
    Character,
    CharacterWithPlayer,
    CharacterWowAudit,
    EditCharacter,
    NewCharacter
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import { charTable, charWowAuditTable } from '@storage/storage.schema'
import { eq } from 'drizzle-orm'
import { newUUID } from '../../utils'
import { charWowAuditStorageToCharacterWowAudit, NewCharacterWowAudit } from './characters.schemas'

export const getCharacterById = async (id: string): Promise<CharacterWithPlayer | null> => {
    const result = await db.query.charTable.findFirst({
        where: (char, { eq }) => eq(char.id, id),
        with: {
            player: true
        }
    })

    if (!result) {
        return null
    }

    return characterWithPlayerSchema.parse(result)
}

export const getCharactersList = async (): Promise<Character[]> => {
    const result = await db.query.charTable.findMany({
        with: {
            player: true
        }
    })
    return charactersListSchema.parse(result)
}

export const addCharacter = async (character: NewCharacter): Promise<string> => {
    const id = newUUID()

    await db.insert(charTable).values({
        id,
        name: character.name,
        realm: character.realm,
        class: character.class,
        role: character.role,
        main: character.main,
        playerId: character.playerId
    })

    return id
}

export const addCharacterWowAudit = async (characters: NewCharacterWowAudit[]): Promise<void> => {
    await db.insert(charWowAuditTable).values(characters)
}

export const getLastCharacterWowAudit = async (
    charName: string,
    charRealm: string
): Promise<CharacterWowAudit | null> => {
    const result = await db.query.charWowAuditTable.findFirst({
        where: (charWowAuditTable, { eq, and }) =>
            and(eq(charWowAuditTable.name, charName), eq(charWowAuditTable.realm, charRealm))
    })
    return result ? charWowAuditStorageToCharacterWowAudit.parse(result) : null
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
