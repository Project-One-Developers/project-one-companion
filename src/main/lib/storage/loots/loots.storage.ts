import { lootWithItemSchema } from '@shared/schemas/loot.schema'
import type { Character, LootWithItem, NewLoot } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { lootTable } from '@storage/storage.schema'
import { getUnixTimestamp, newUUID } from '@utils'
import { eq, InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'

export const getLootsByRaidSessionId = async (raidSessionId: string): Promise<LootWithItem[]> => {
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
            tertiaryStat: false, // TODO: implement
            raidDifficulty: loot.raidDifficulty,
            socket: loot.socket,
            itemString: loot.itemString,
            bonusString: loot.bonusString,
            charsEligibility: elegibleCharacters.map((c) => c.id),
            raidSessionId: raidSessionId,
            rclootId: loot.rclootId,
            itemId: loot.itemId
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
