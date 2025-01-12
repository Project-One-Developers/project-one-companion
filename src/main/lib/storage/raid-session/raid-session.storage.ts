import { raidSessionSchema } from '@shared/schemas/raid.schemas'
import type { NewRaidSession, RaidSession } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { raidSessionRosterTable, raidSessionTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq, InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'
import { newUUID } from '../../utils'

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
                    character: true
                }
            }
        }
    })

    const processedResult = flattenRaidPartecipation(result)
    return raidSessionSchema.parse(processedResult)
}

export const getRaidSessionList = async (): Promise<RaidSession[]> => {
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
