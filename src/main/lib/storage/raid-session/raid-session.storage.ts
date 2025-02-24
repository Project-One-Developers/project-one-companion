import { characterSchema } from '@shared/schemas/characters.schemas'
import {
    raidSessionSchema,
    raidSessionWithRosterSchema,
    raidSessionWithSummarySchema
} from '@shared/schemas/raid.schemas'
import type {
    Character,
    EditRaidSession,
    NewRaidSession,
    RaidSession,
    RaidSessionWithRoster,
    RaidSessionWithSummary
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import {
    charTable,
    lootTable,
    raidSessionRosterTable,
    raidSessionTable
} from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { count, eq, InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'
import { newUUID } from '../../utils'

const flattenRaidPartecipation = (result: any): RaidSessionWithRoster => {
    return {
        ...result,
        roster:
            result?.charPartecipation?.map(
                (charPartecipation: any) => charPartecipation.character
            ) || []
    }
}

export const getRaidSessionWithRoster = async (id: string): Promise<RaidSessionWithRoster> => {
    const result = await db().query.raidSessionTable.findFirst({
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
    return raidSessionWithRosterSchema.parse(processedResult)
}

export const getRaidSession = async (id: string): Promise<RaidSession> => {
    const result = await db().query.raidSessionTable.findFirst({
        where: (raidSessionTable, { eq }) => eq(raidSessionTable.id, id)
    })
    return raidSessionSchema.parse(result)
}

export const getRaidSessios = async (): Promise<RaidSession[]> => {
    const result = await db().query.raidSessionTable.findMany()
    return z.array(raidSessionSchema).parse(result)
}

const countLoot = async (id: string): Promise<number> => {
    const res = await db()
        .select({ count: count() })
        .from(lootTable)
        .where(eq(lootTable.raidSessionId, id))

    return res[0]?.count || 0
}
const countRoster = async (id: string): Promise<number> => {
    const res = await db()
        .select({ count: count() })
        .from(raidSessionRosterTable)
        .where(eq(raidSessionRosterTable.raidSessionId, id))

    return res[0]?.count || 0
}

export const getRaidSessionWithSummaryList = async (): Promise<RaidSessionWithSummary[]> => {
    const sessions = await getRaidSessios()

    const allPromise = sessions.map(async (s) => {
        const [lootCount, rosterCount] = await Promise.all([countLoot(s.id), countRoster(s.id)])
        return {
            ...s,
            rosterCount: rosterCount,
            lootCount: lootCount
        }
    })

    const result = await Promise.all(allPromise)
    return z.array(raidSessionWithSummarySchema).parse(result)
}

export const editRaidSession = async (editedRaidSession: EditRaidSession): Promise<string> => {
    return await db().transaction(async (tx) => {
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
    return await db().transaction(async (tx) => {
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
    await db().delete(raidSessionTable).where(eq(raidSessionTable.id, id))
}

export const getRaidSessionRoster = async (id: string): Promise<Character[]> => {
    const result = await db()
        .select()
        .from(raidSessionRosterTable)
        .innerJoin(charTable, eq(raidSessionRosterTable.charId, charTable.id))
        .where(eq(raidSessionRosterTable.raidSessionId, id))

    return z.array(characterSchema).parse(result.flatMap((sr) => sr.characters))
}
