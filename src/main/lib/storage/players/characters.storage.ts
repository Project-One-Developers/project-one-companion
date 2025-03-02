import { characterSchema, characterWithPlayerSchema } from '@shared/schemas/characters.schemas'
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
import { z } from 'zod'
import { newUUID } from '../../utils'
import { charWowAuditStorageToCharacterWowAudit, NewCharacterWowAudit } from './characters.schemas'

export const getCharacterWithPlayerById = async (
    id: string
): Promise<CharacterWithPlayer | null> => {
    const result = await db().query.charTable.findFirst({
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

export const getCharactersWithPlayerList = async (): Promise<CharacterWithPlayer[]> => {
    const result = await db().query.charTable.findMany({
        with: {
            player: true
        }
    })
    return z.array(characterWithPlayerSchema).parse(result)
}

export const getCharactersList = async (): Promise<Character[]> => {
    const result = await db().query.charTable.findMany()
    return z.array(characterSchema).parse(result)
}

export const addCharacter = async (character: NewCharacter): Promise<string> => {
    const id = newUUID()

    await db().insert(charTable).values({
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
    await db().insert(charWowAuditTable).values(characters)
}

export const getLastCharacterWowAudit = async (
    charName: string,
    charRealm: string
): Promise<CharacterWowAudit | null> => {
    const result = await db().query.charWowAuditTable.findFirst({
        where: (charWowAuditTable, { eq, and }) =>
            and(eq(charWowAuditTable.name, charName), eq(charWowAuditTable.realm, charRealm))
    })
    return result ? charWowAuditStorageToCharacterWowAudit.parse(result) : null
}

export const getAllCharacterWowAudit = async (): Promise<CharacterWowAudit[]> => {
    const result = await db().query.charWowAuditTable.findMany()
    return z.array(charWowAuditStorageToCharacterWowAudit).parse(result)
}

export const deleteAllCharacterWowAudit = async (): Promise<void> => {
    await db().delete(charWowAuditTable)
}

export const getLastWowAuditSync = async (): Promise<number | null> => {
    const result = await db().query.charWowAuditTable.findFirst()
    return result ? result.wowauditLastModifiedUnixTs : null
}

export const editCharacter = async (edited: EditCharacter): Promise<void> => {
    await db()
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
    await db().delete(charTable).where(eq(charTable.id, id))
}
