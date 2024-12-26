import { Droptimizer, NewDroptimizer } from '../../../../../shared/types'
import { newUUID } from '../../utils'
import { db } from '../storage.config'
import { droptimizerTable, droptimizerUpgradesTable } from '../storage.schema'
import { parseAndValidate, takeFirstResult } from '../storage.utils'
import { droptimizerModelSchema } from './droptimizer.schemas'
import { UpgradesTableInsert } from './droptimizer.types'

export const getDroptimizer = async (droptimizerId: string): Promise<Droptimizer | null> => {
    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.id, droptimizerId),
        with: {
            upgrades: true
        }
    })

    return parseAndValidate(droptimizerModelSchema, result)
}

export const addDroptimizer = async (droptimizer: NewDroptimizer): Promise<Droptimizer | null> => {
    const droptimizerId = await db.transaction(async (tx) => {
        const droptimizerRes = await tx
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
            .then(takeFirstResult)

        if (!droptimizerRes) {
            tx.rollback()
            console.log('Failed to insert droptimizer. Droptimizer:', droptimizer)
            return null
        }

        const upgradesArray: UpgradesTableInsert[] = droptimizer.upgrades.map((up) => ({
            id: newUUID(),
            droptimizerId: droptimizerRes.id,
            itemId: up.itemId,
            dps: up.dps.toString()
        }))

        await tx.insert(droptimizerUpgradesTable).values(upgradesArray).execute()

        return droptimizerRes.id
    })

    if (!droptimizerId) {
        return null
    }

    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.id, droptimizerId),
        with: {
            upgrades: true
        }
    })

    return parseAndValidate(droptimizerModelSchema, result)
}
