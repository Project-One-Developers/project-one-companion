import { CharacterRaiderio, charRaiderioSchema } from '@shared/schemas/raiderio.schemas'
import { db } from '@storage/storage.config'
import { charRaiderioTable } from '@storage/storage.schema'
import { conflictUpdateAllExcept } from '@storage/storage.utils'
import { z } from 'zod'

export const addCharacterRaiderio = async (characters: CharacterRaiderio[]): Promise<void> => {
    await db().insert(charRaiderioTable).values(characters)
}

export const upsertCharacterRaiderio = async (characters: CharacterRaiderio[]): Promise<void> => {
    await db()
        .insert(charRaiderioTable)
        .values(characters)
        .onConflictDoUpdate({
            target: [charRaiderioTable.name, charRaiderioTable.realm],
            set: conflictUpdateAllExcept(charRaiderioTable, ['name', 'realm'])
        })
}

export const getLastTimeSyncedRaiderio = async (): Promise<number | null> => {
    const result = await db().query.charRaiderioTable.findFirst({
        orderBy: (charRaiderioTable, { desc }) => desc(charRaiderioTable.p1SyncAt)
    })
    return result ? result.p1SyncAt : null
}

export const getLastRaiderioInfo = async (
    charName: string,
    charRealm: string
): Promise<CharacterRaiderio | null> => {
    const result = await db().query.charRaiderioTable.findFirst({
        where: (charRaiderioTable, { eq, and }) =>
            and(eq(charRaiderioTable.name, charName), eq(charRaiderioTable.realm, charRealm))
    })
    return result ? charRaiderioSchema.parse(result) : null
}

export const getAllCharacterRaiderio = async (): Promise<CharacterRaiderio[]> => {
    const result = await db().query.charRaiderioTable.findMany()
    return z.array(charRaiderioSchema).parse(result)
}

export const deleteAllCharacterRaiderio = async (): Promise<void> => {
    await db().delete(charRaiderioTable)
}
