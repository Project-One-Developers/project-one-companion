import { eq } from 'drizzle-orm'
import { droptimizerSchema } from '../../../../../shared/schemas'
import { Droptimizer, NewDroptimizer } from '../../../../../shared/types'
import { newUUID } from '../../utils'
import { db } from '../storage.config'
import { droptimizerTable, droptimizerUpgradesTable } from '../storage.schema'
import { parseAndValidate, takeFirstResult } from '../storage.utils'

export const getDroptimizer = async (droptimizerId: string): Promise<Droptimizer | null> => {
    const result = await db
        .select()
        .from(droptimizerTable)
        .where(eq(droptimizerTable.id, droptimizerId))
        .then(takeFirstResult)

    return parseAndValidate(droptimizerSchema, result)
}

export const addDroptimizer = async (droptimizer: NewDroptimizer): Promise<Droptimizer | null> => {
    const insertedId = await db.transaction(async (tx) => {
        const result = await tx
            .insert(droptimizerTable)
            .values({
                id: newUUID(),
                url: droptimizer.url,
                resultRaw: droptimizer.resultRaw,
                date: droptimizer.date,
                raidDifficulty: droptimizer.raidDifficulty,
                fightStyle: droptimizer.fightInfo.fightstyle,
                duration: droptimizer.fightInfo.duration,
                nTargets: droptimizer.fightInfo.nTargets,
                characterName: droptimizer.characterName
            })
            .returning({ id: droptimizerTable.id })

        // remap NewDroptimizer.upgrades
        const upgradesArray = droptimizer.upgrades.map((up) => ({
            id: newUUID(),
            droptimizerId: result[0].id,
            itemId: up.itemId,
            dps: '' + up.dps // todo: fixare in float
        }))

        await tx.insert(droptimizerUpgradesTable).values(upgradesArray).returning().execute()

        return result[0].id
    })

    // recupero il droptimizer appena inserito
    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.id, insertedId),
        with: {
            upgrades: true
        }
    })

    return parseAndValidate(droptimizerSchema, result)
}
