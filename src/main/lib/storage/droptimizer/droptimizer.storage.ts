import { itemToCatalystArraySchema, itemToTiersetArraySchema } from '@shared/schemas/wow.schemas'
import type {
    Droptimizer,
    ItemToCatalyst,
    ItemToTierset,
    NewDroptimizer
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import { droptimizerTable, droptimizerUpgradesTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq } from 'drizzle-orm'
import { newUUID } from '../../utils'
import { droptimizerListStorageSchema, droptimizerStorageSchema } from './droptimizer.schemas'
import type { UpgradesTableInsert } from './droptimizer.types'

/**
 * Retrieves a Droptimizer by its ID from the database.
 *
 * @param droptimizerId - The unique identifier of the Droptimizer to retrieve.
 * @returns A Promise that resolves to the Droptimizer object if found, or null if not found.
 */
export const getDroptimizer = async (url: string): Promise<Droptimizer | null> => {
    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.url, url),
        with: {
            upgrades: true
        }
    })

    if (!result) {
        return null
    }

    return droptimizerStorageSchema.parse(result)
}

export const getItemToTiersetMapping = async (): Promise<ItemToTierset[]> => {
    const result = await db.query.itemToTiersetTable.findMany()
    return itemToTiersetArraySchema.parse(result)
}
export const getItemToCatalystMapping = async (): Promise<ItemToCatalyst[]> => {
    const result = await db.query.itemToCatalystTable.findMany()
    return itemToCatalystArraySchema.parse(result)
}

/**
 * Retrieves the latest Droptimizer data for a specific character and raid difficulty.
 *
 * @param charName - The name of the character to retrieve Droptimizer data for.
 * @param raidDiff - The raid difficulty to filter the Droptimizer data.
 * @returns A Promise that resolves to a Droptimizer object if found, or null if no data is available.
 *
 * @description
 * This function queries the database to find the most recent Droptimizer entry for the specified character
 * and raid difficulty. It includes the associated upgrades.
 */
export const getLatestDroptimizerByCharAndDiff = async (
    charName: string,
    raidDiff: string
): Promise<Droptimizer | null> => {
    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq, and }) =>
            and(
                eq(droptimizerTable.characterName, charName),
                eq(droptimizerTable.raidDifficulty, raidDiff)
            ),
        orderBy: (droptimizerTable, { desc }) => [desc(droptimizerTable.date)],
        with: {
            upgrades: true
        }
    })

    if (!result) {
        return null
    }

    return droptimizerStorageSchema.parse(result)
}

export const getDroptimizerList = async (): Promise<Droptimizer[]> => {
    const result = await db.query.droptimizerTable.findMany({
        with: {
            upgrades: true
        }
    })

    return droptimizerListStorageSchema.parse(result)
}

export const addDroptimizer = async (droptimizer: NewDroptimizer): Promise<Droptimizer> => {
    const droptimizerId = await db.transaction(async (tx) => {
        // se è già stato importato, per ora sovrascrivo poi vedremo
        await tx.delete(droptimizerTable).where(eq(droptimizerTable.url, droptimizer.url))

        const droptimizerRes = await tx
            .insert(droptimizerTable)
            .values({
                url: droptimizer.url,
                resultRaw: droptimizer.resultRaw,
                date: droptimizer.date,
                dateImported: droptimizer.dateImported,
                raidDifficulty: droptimizer.raidDifficulty,
                fightStyle: droptimizer.fightInfo.fightstyle,
                duration: droptimizer.fightInfo.duration,
                nTargets: droptimizer.fightInfo.nTargets,
                characterName: droptimizer.characterName
            })
            .returning({ url: droptimizerTable.url })
            .then(takeFirstResult)

        if (!droptimizerRes) {
            tx.rollback()
            const errorMsg = `Failed to insert droptimizer. Droptimizer: ${JSON.stringify(droptimizer)}`
            console.log(errorMsg)
            throw new Error(errorMsg)
        }

        const upgradesArray: UpgradesTableInsert[] = droptimizer.upgrades.map((up) => {
            const res: UpgradesTableInsert = {
                id: newUUID(),
                droptimizerId: droptimizerRes.url,
                itemId: up.itemId,
                slot: up.slot,
                dps: up.dps,
                catalyzedItemId: up.catalyzedItemId
            }
            return res
        })

        await tx.insert(droptimizerUpgradesTable).values(upgradesArray)

        return droptimizerRes.url
    })

    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.url, droptimizerId),
        with: {
            upgrades: true
        }
    })

    return droptimizerStorageSchema.parse(result)
}

export const deleteDroptimizer = async (url: string): Promise<void> => {
    // droptimizerUpgradesTable will be deleted on "cascade"
    await db.delete(droptimizerTable).where(eq(droptimizerTable.url, url))
}
