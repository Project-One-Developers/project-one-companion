import { charactersListSchema } from '@shared/schemas/characters.schemas'
import { raidSessionSchema } from '@shared/schemas/raid.schemas'
import type {
    Character,
    EditRaidSession,
    NewLoot,
    NewRaidSession,
    RaidSession
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import {
    charTable,
    lootTable,
    raidSessionRosterTable,
    raidSessionTable
} from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq, InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'
import { getUnixTimestamp, newUUID } from '../../utils'

const flattenRaidPartecipation = (result: any): RaidSession => {
    return {
        ...result,
        roster:
            result?.charPartecipation?.map(
                (charPartecipation: any) => charPartecipation.character
            ) || []
    }
}

export const getRaidSession = async (id: string): Promise<RaidSession> => {
    const result = await db.query.raidSessionTable.findFirst({
        where: (raidSessionTable, { eq }) => eq(raidSessionTable.id, id),
        with: {
            charPartecipation: {
                with: {
                    character: {
                        with: {
                            player: true
                        }
                    }
                }
            }
        }
    })

    const processedResult = flattenRaidPartecipation(result)
    return raidSessionSchema.parse(processedResult)
}

export const getRaidSessionList = async (): Promise<RaidSession[]> => {
    // todo: switchare in query raid session + count loot + count partecipation
    const result = await db.query.raidSessionTable.findMany({
        with: {
            charPartecipation: {
                with: {
                    character: true
                }
            }
        }
    })

    const processedResults = result.map(flattenRaidPartecipation)
    return z.array(raidSessionSchema).parse(processedResults)
}

export const editRaidSession = async (editedRaidSession: EditRaidSession): Promise<string> => {
    return await db.transaction(async (tx) => {
        const res = await tx
            .update(raidSessionTable)
            .set({
                name: editedRaidSession.name,
                raidDate: editedRaidSession.raidDate
            })
            .where(eq(raidSessionTable.id, editedRaidSession.id))

        if (!res) {
            tx.rollback()
            const errorMsg = `Failed to insert a raid session. RaidSession: ${JSON.stringify(editedRaidSession)}`
            console.log(errorMsg)
            throw new Error(errorMsg)
        }

        // delete old partecipation
        await tx
            .delete(raidSessionRosterTable)
            .where(eq(raidSessionRosterTable.raidSessionId, editedRaidSession.id))

        // insert updated roster
        const raidPartecipation = editedRaidSession.roster.map(
            (characterId): InferInsertModel<typeof raidSessionRosterTable> => ({
                raidSessionId: editedRaidSession.id,
                charId: characterId
            })
        )

        await tx.insert(raidSessionRosterTable).values(raidPartecipation)

        return editedRaidSession.id
    })
}

export const addRaidSession = async (newRaidSession: NewRaidSession): Promise<string> => {
    return await db.transaction(async (tx) => {
        const res = await tx
            .insert(raidSessionTable)
            .values({
                id: newUUID(),
                name: newRaidSession.name,
                raidDate: newRaidSession.raidDate
            })
            .returning({ id: raidSessionTable.id })
            .then(takeFirstResult)

        if (!res) {
            tx.rollback()
            const errorMsg = `Failed to insert a raid session. RaidSession: ${JSON.stringify(newRaidSession)}`
            console.log(errorMsg)
            throw new Error(errorMsg)
        }

        const raidPartecipation = newRaidSession.roster.map(
            (characterId): InferInsertModel<typeof raidSessionRosterTable> => ({
                raidSessionId: res.id,
                charId: characterId
            })
        )

        await tx.insert(raidSessionRosterTable).values(raidPartecipation)

        return res.id
    })
}

export const deleteRaidSession = async (id: string): Promise<void> => {
    await db.delete(raidSessionTable).where(eq(raidSessionTable.id, id))
}

export const getRaidSessionRoster = async (id: string): Promise<Character[]> => {
    const result = await db
        .select()
        .from(raidSessionRosterTable)
        .innerJoin(charTable, eq(raidSessionRosterTable.charId, charTable.id))
        .where(eq(raidSessionRosterTable.raidSessionId, id))

    return charactersListSchema.parse(result.flatMap((sr) => sr.characters))
}

export const addLoots = async (
    raidSessionId: string,
    loots: NewLoot[],
    elegibleCharacters: Character[]
): Promise<void> => {
    await db.transaction(async (tx) => {
        const lootValues = loots.map((loot): InferInsertModel<typeof lootTable> => {
            return {
                id: newUUID(),
                dropDate: loot.dropDate ?? getUnixTimestamp(),
                thirdStat: '',
                socket: loot.socket,
                charsEligibility: elegibleCharacters.map((c) => c.id),
                raidSessionId: raidSessionId,
                rclootId: loot.rclootId,
                itemId: loot.itemId
            }
        })

        await tx
            .insert(lootTable)
            .values(lootValues)
            .onConflictDoNothing({ target: lootTable.rclootId }) // do nothing on item already inserted
    })
}
