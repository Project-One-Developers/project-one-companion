import { lootSchema, lootWithAssignedSchema, lootWithItemSchema } from '@shared/schemas/loot.schema'
import type { Character, Loot, LootWithAssigned, LootWithItem, NewLoot } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { lootTable } from '@storage/storage.schema'
import { getUnixTimestamp, newUUID } from '@utils'
import { eq, InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'

export const getLootById = async (lootId: string): Promise<Loot> => {
    const result = await db.query.lootTable.findFirst({
        where: (lootTable, { eq }) => eq(lootTable.id, lootId)
    })
    return lootSchema.parse(result)
}

export const getLootWithItemById = async (lootId: string): Promise<LootWithItem> => {
    const result = await db.query.lootTable.findFirst({
        where: (lootTable, { eq }) => eq(lootTable.id, lootId),
        with: {
            item: true
        }
    })
    return lootWithItemSchema.parse(result)
}

export const getLootsByRaidSessionId = async (raidSessionId: string): Promise<Loot[]> => {
    const result = await db.query.lootTable.findMany({
        where: (lootTable, { eq }) => eq(lootTable.raidSessionId, raidSessionId)
    })
    return z.array(lootSchema).parse(result)
}

export const getLootsByRaidSessionIdWithAssigned = async (
    raidSessionId: string
): Promise<LootWithAssigned[]> => {
    const result = await db.query.lootTable.findMany({
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
    const result = await db.query.lootTable.findMany({
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
    const lootValues = loots.map((loot): InferInsertModel<typeof lootTable> => {
        return {
            id: newUUID(),
            dropDate: loot.dropDate ?? getUnixTimestamp(),
            gearItem: loot.gearItem,
            raidDifficulty: loot.raidDifficulty,
            itemString: loot.itemString,
            charsEligibility: elegibleCharacters.map((c) => c.id),
            raidSessionId: raidSessionId,
            rclootId: loot.rclootId,
            itemId: loot.gearItem.item.id
        }
    })

    await db
        .insert(lootTable)
        .values(lootValues)
        .onConflictDoNothing({ target: lootTable.rclootId }) // do nothing on item already inserted
}

export const assignLoot = async (charId: string, lootId: string, score?: number): Promise<void> => {
    console.log(score)
    await db
        .update(lootTable)
        .set({
            assignedCharacterId: charId
        })
        .where(eq(lootTable.id, lootId))
}
export const unassignLoot = async (lootId: string): Promise<void> => {
    await db
        .update(lootTable)
        .set({
            assignedCharacterId: null
        })
        .where(eq(lootTable.id, lootId))
}
