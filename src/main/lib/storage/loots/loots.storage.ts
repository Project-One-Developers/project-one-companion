import { lootSchema, lootWithAssignedSchema, lootWithItemSchema } from '@shared/schemas/loot.schema'
import type {
    Character,
    CharAssignmentHighlights,
    Loot,
    LootWithAssigned,
    LootWithItem,
    NewLoot
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import { lootTable } from '@storage/storage.schema'
import { newUUID } from '@utils'
import { eq, InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'

export const getLootById = async (lootId: string): Promise<Loot> => {
    const result = await db().query.lootTable.findFirst({
        where: (lootTable, { eq }) => eq(lootTable.id, lootId)
    })
    return lootSchema.parse(result)
}

export const getLootWithItemById = async (lootId: string): Promise<LootWithItem> => {
    const result = await db().query.lootTable.findFirst({
        where: (lootTable, { eq }) => eq(lootTable.id, lootId),
        with: {
            item: true
        }
    })
    return lootWithItemSchema.parse(result)
}

export const getLootAssigned = async (): Promise<Loot[]> => {
    const result = await db().query.lootTable.findMany({
        where: (lootTable, { isNotNull }) => isNotNull(lootTable.raidSessionId)
    })
    return z.array(lootSchema).parse(result)
}

export const getLootAssignedBySession = async (raidSessionId: string): Promise<Loot[]> => {
    const result = await db().query.lootTable.findMany({
        where: (lootTable, { eq, and, isNotNull }) =>
            and(
                eq(lootTable.raidSessionId, raidSessionId),
                isNotNull(lootTable.assignedCharacterId)
            )
    })
    return z.array(lootSchema).parse(result)
}

export const getLootsByRaidSessionId = async (raidSessionId: string): Promise<Loot[]> => {
    const result = await db().query.lootTable.findMany({
        where: (lootTable, { eq }) => eq(lootTable.raidSessionId, raidSessionId)
    })
    return z.array(lootSchema).parse(result)
}

export const getLootsByRaidSessionIdWithAssigned = async (
    raidSessionId: string
): Promise<LootWithAssigned[]> => {
    const result = await db().query.lootTable.findMany({
        where: (lootTable, { eq }) => eq(lootTable.raidSessionId, raidSessionId),
        with: {
            assignedCharacter: true
        }
    })
    return z.array(lootWithAssignedSchema).parse(result)
}

export const getLootsByRaidSessionIdWithItem = async (
    raidSessionId: string
): Promise<LootWithItem[]> => {
    const result = await db().query.lootTable.findMany({
        where: (lootTable, { eq }) => eq(lootTable.raidSessionId, raidSessionId),
        with: {
            item: true
        }
    })
    return z.array(lootWithItemSchema).parse(result)
}

export const addLoots = async (
    raidSessionId: string,
    loots: NewLoot[],
    elegibleCharacters: Character[]
): Promise<void> => {
    const lootValues: InferInsertModel<typeof lootTable>[] = loots.map(loot => ({
        id: loot.addonId ?? newUUID(),
        charsEligibility: elegibleCharacters.map(c => c.id),
        itemId: loot.gearItem.item.id,
        raidSessionId,
        dropDate: loot.dropDate,
        gearItem: loot.gearItem,
        raidDifficulty: loot.raidDifficulty,
        itemString: loot.itemString,
        tradedToAssigned: false,
        assignedCharacterId: loot.assignedTo // rc could import assigned character (without highlights / reason), mrt does not
    }))

    await db().insert(lootTable).values(lootValues).onConflictDoNothing({ target: lootTable.id })
}

export const assignLoot = async (
    charId: string,
    lootId: string,
    highlights: CharAssignmentHighlights
): Promise<void> => {
    await db()
        .update(lootTable)
        .set({
            assignedCharacterId: charId,
            assignedHighlights: highlights
        })
        .where(eq(lootTable.id, lootId))
}

export const unassignLoot = async (lootId: string): Promise<void> => {
    await db()
        .update(lootTable)
        .set({
            assignedCharacterId: null
        })
        .where(eq(lootTable.id, lootId))
}

export const tradeLoot = async (lootId: string): Promise<void> => {
    await db()
        .update(lootTable)
        .set({
            tradedToAssigned: true
        })
        .where(eq(lootTable.id, lootId))
}

export const untradeLoot = async (lootId: string): Promise<void> => {
    await db()
        .update(lootTable)
        .set({
            tradedToAssigned: false
        })
        .where(eq(lootTable.id, lootId))
}

export const deleteLoot = async (lootId: string): Promise<void> => {
    await db().delete(lootTable).where(eq(lootTable.id, lootId))
}
