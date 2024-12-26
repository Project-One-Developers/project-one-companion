import { upsertItems } from '../../lib/storage/items/items.storage'

import * as fs from 'fs'
import * as path from 'path'
import { bossSchema, itemSchema } from '../../../../shared/schemas'
import { upsertBosses } from '../../lib/storage/boss/boss.storage'

export const reloadItemsHandler = async (): Promise<null> => {
    console.log('Reloading resources/items.csv')

    const csvFilePath = path.join(__dirname, '../../resources/items.csv') // todo: far arrivare questa risorsa in out folder

    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
        console.error('File not found:', csvFilePath)
    }

    // Read the CSV file as a string
    const csvData = fs.readFileSync(csvFilePath, 'utf-8')

    // Remove first and last row (header and empty row)
    const itemsAndBosses = csvData
        .split('\n')
        .slice(1, -1)
        .map((row) => {
            const [
                order,
                bossName,
                itemName,
                journalEncounterId,
                ilvlMythic,
                ilvlHeroic,
                ilvlNormal,
                tier,
                itemId,
                icon,
                iconName,
                bonusId,
                itemClass,
                slot,
                itemSubclass,
                tierPrefix,
                raid,
                specs,
                specIds,
                classes,
                classesId,
                stats,
                mainStats,
                secondaryStats,
                wowheadUrl,
                iconUrl
            ] = row.split(',')

            const item = itemSchema.parse({
                id: Number(itemId),
                name: itemName,
                ilvlMythic: Number(ilvlMythic),
                ilvlHeroic: Number(ilvlHeroic),
                ilvlNormal: Number(ilvlNormal),
                bonusId,
                itemClass,
                slot,
                itemSubclass,
                tierPrefix,
                tier: 'Token' === itemSubclass,
                veryRare: 'Very Rare' === bonusId,
                specs,
                specIds,
                classes,
                classesId,
                stats,
                mainStats,
                secondaryStats,
                wowheadUrl,
                iconName,
                iconUrl,
                bossName
            })

            const boss = bossSchema.parse({
                id: Number(journalEncounterId),
                name: bossName,
                raid,
                order: Number(order)
            })

            return { item, boss }
        })

    // update bosses
    const items = itemsAndBosses.map((iab) => iab.item)
    const bosses = itemsAndBosses.map((iab) => iab.boss)

    // upsert bosses
    await upsertBosses(bosses)

    // upsert items
    await upsertItems(items)

    return null
}
