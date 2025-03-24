import type { Droptimizer, NewDroptimizer, WowRaidDifficulty } from '@shared/types/types'
import { db } from '@storage/storage.config'
import { droptimizerTable, droptimizerUpgradesTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq, InferInsertModel, lte, sql } from 'drizzle-orm'
import { newUUID } from '../../utils'
import { droptimizerStorageListToSchema, droptimizerStorageToSchema } from './droptimizer.schemas'

/**
 * Retrieves a Droptimizer by its ID from the database.
 *
 * @param droptimizerId - The unique identifier of the Droptimizer to retrieve.
 * @returns A Promise that resolves to the Droptimizer object if found, or null if not found.
 */
export const getDroptimizer = async (url: string): Promise<Droptimizer | null> => {
    const result = await db().query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.url, url),
        with: {
            upgrades: true
        }
    })

    if (!result) {
        return null
    }

    return droptimizerStorageToSchema.parse(result)
}

export const getDroptimizerList = async (): Promise<Droptimizer[]> => {
    const result = await db().query.droptimizerTable.findMany({
        with: {
            upgrades: {
                columns: {
                    itemId: false //ignored
                },
                with: {
                    item: true
                }
            }
        }
    })

    return droptimizerStorageListToSchema.parse(result)
}

export const getDroptimizerByIdsList = async (ids: string[]): Promise<Droptimizer[]> => {
    const result = await db().query.droptimizerTable.findMany({
        where: (droptimizerTable, { inArray }) => inArray(droptimizerTable.url, ids), // Filter by URLs in the ids array
        with: {
            upgrades: {
                columns: {
                    itemId: false //ignored
                },
                with: {
                    item: true
                }
            }
        }
    })

    return droptimizerStorageListToSchema.parse(result)
}

export const getDroptimizerLatestList = async (): Promise<Droptimizer[]> => {
    const latestDroptimizers: { url: string }[] = await db().execute(
        sql`
            SELECT DISTINCT ON (${droptimizerTable.ak}) url
            FROM ${droptimizerTable}
            ORDER BY ${droptimizerTable.ak}, ${droptimizerTable.simDate} DESC
        `
    )

    const urls = latestDroptimizers.map(row => row.url)

    return getDroptimizerByIdsList(urls)
}

export const getDroptimizerLastByCharAndDiff = async (
    charName: string,
    charRealm: string,
    raidDiff: WowRaidDifficulty
): Promise<Droptimizer | null> => {
    const result = await db().query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq, and }) =>
            and(
                eq(droptimizerTable.characterName, charName),
                eq(droptimizerTable.characterServer, charRealm),
                eq(droptimizerTable.raidDifficulty, raidDiff)
            ),
        orderBy: (droptimizerTable, { desc }) => desc(droptimizerTable.simDate),
        with: {
            upgrades: {
                columns: {
                    itemId: false //ignored
                },
                with: {
                    item: true
                }
            }
        }
    })
    return result ? droptimizerStorageToSchema.parse(result) : null
}

export const getDroptimizerLastByChar = async (
    charName: string,
    charRealm: string
): Promise<Droptimizer | null> => {
    const result = await db().query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq, and }) =>
            and(
                eq(droptimizerTable.characterName, charName),
                eq(droptimizerTable.characterServer, charRealm)
            ),
        orderBy: (droptimizerTable, { desc }) => desc(droptimizerTable.simDate),
        with: {
            upgrades: {
                columns: {
                    itemId: false //ignored
                },
                with: {
                    item: true
                }
            }
        }
    })
    return result ? droptimizerStorageToSchema.parse(result) : null
}

export const addDroptimizer = async (droptimizer: NewDroptimizer): Promise<Droptimizer> => {
    const droptimizerId = await db().transaction(async tx => {
        // se è già stato importato, per ora sovrascrivo poi vedremo
        //await tx.delete(droptimizerTable).where(eq(droptimizerTable.url, droptimizer.url))

        // we keep only the latest version for a given ak
        const alreadyPresent = await tx.query.droptimizerTable.findFirst({
            where: (droptimizerTable, { eq }) => eq(droptimizerTable.ak, droptimizer.ak)
        })

        if (alreadyPresent) {
            if (alreadyPresent.simDate >= droptimizer.simInfo.date) {
                console.log(
                    'addDroptimizer: not importing droptimizer because it is not newer than previously imported - ak: ' +
                        droptimizer.ak
                )
                //tx.rollback()
                return alreadyPresent.url
            } else {
                // we delete the older droptimizer with the same ak
                await tx
                    .delete(droptimizerTable)
                    .where(eq(droptimizerTable.url, alreadyPresent.url))
            }
        }

        const droptimizerRes = await tx
            .insert(droptimizerTable)
            .values({
                url: droptimizer.url,
                ak: droptimizer.ak,
                dateImported: droptimizer.dateImported,
                simDate: droptimizer.simInfo.date,
                simFightStyle: droptimizer.simInfo.fightstyle,
                simDuration: droptimizer.simInfo.duration,
                simNTargets: droptimizer.simInfo.nTargets,
                simUpgradeEquipped: droptimizer.simInfo.upgradeEquipped,
                raidId: droptimizer.raidInfo.id,
                raidDifficulty: droptimizer.raidInfo.difficulty,
                characterName: droptimizer.charInfo.name,
                characterServer: droptimizer.charInfo.server,
                characterClass: droptimizer.charInfo.class,
                characterClassId: droptimizer.charInfo.classId,
                characterSpec: droptimizer.charInfo.spec,
                characterSpecId: droptimizer.charInfo.specId,
                characterTalents: droptimizer.charInfo.talents,
                weeklyChest: droptimizer.weeklyChest,
                currencies: droptimizer.currencies,
                itemsEquipped: droptimizer.itemsEquipped,
                itemsInBag: droptimizer.itemsInBag,
                tiersetInfo: droptimizer.tiersetInfo
            })
            .returning({ url: droptimizerTable.url })
            .then(takeFirstResult)

        if (!droptimizerRes) {
            tx.rollback()
            const errorMsg = `Failed to insert droptimizer. Droptimizer: ${JSON.stringify(droptimizer)}`
            console.log(errorMsg)
            throw new Error(errorMsg)
        }

        const upgradesArray = droptimizer.upgrades.map(
            (up): InferInsertModel<typeof droptimizerUpgradesTable> => ({
                id: newUUID(),
                droptimizerId: droptimizerRes.url,
                ...up
            })
        )

        if (upgradesArray.length > 0) {
            await tx.insert(droptimizerUpgradesTable).values(upgradesArray)
        }
        return droptimizerRes.url
    })

    const result = await db().query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.url, droptimizerId),
        with: {
            upgrades: {
                columns: {
                    itemId: false //ignored
                },
                with: {
                    item: true
                }
            }
        }
    })

    return droptimizerStorageToSchema.parse(result)
}

export const deleteDroptimizer = async (url: string): Promise<void> => {
    // droptimizerUpgradesTable will be deleted on "cascade"
    await db().delete(droptimizerTable).where(eq(droptimizerTable.url, url))
}

export const deleteDroptimizerOlderThanDate = async (dateUnixTs: number): Promise<void> => {
    // droptimizerUpgradesTable will be deleted on "cascade"
    await db().delete(droptimizerTable).where(lte(droptimizerTable.simDate, dateUnixTs))
}

export const getLatestDroptimizerUnixTs = async (): Promise<number | null> => {
    const result = await db().query.droptimizerTable.findFirst({
        orderBy: (droptimizerTable, { desc }) => desc(droptimizerTable.simDate)
    })
    return result ? result.simDate : null
}
