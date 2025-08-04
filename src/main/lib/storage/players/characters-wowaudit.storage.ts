import type { CharacterWowAudit } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { charWowAuditTable } from '@storage/storage.schema'
import { z } from 'zod'
import { charWowAuditStorageToCharacterWowAudit, NewCharacterWowAudit } from './characters.schemas'

export const addCharacterWowAudit = async (characters: NewCharacterWowAudit[]): Promise<void> => {
    await db().insert(charWowAuditTable).values(characters)
}

export const getLastTimeSyncedWowAudit = async (): Promise<number | null> => {
    const result = await db().query.charWowAuditTable.findFirst({
        orderBy: (charWowAuditTable, { desc }) => desc(charWowAuditTable.wowauditLastModifiedUnixTs)
    })
    return result ? result.wowauditLastModifiedUnixTs : null
}

export const getLastWowAuditInfo = async (
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
