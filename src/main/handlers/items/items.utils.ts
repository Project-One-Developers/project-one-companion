import * as path from 'path'
import { z } from 'zod'
import { bossSchema, itemSchema } from '../../../../shared/schemas'
import { Boss, Item } from '../../../../shared/types'

export const fetchRaidItems = async (): Promise<Item[]> => {
    const jsonData = require(path.join(__dirname, '../../resources/wow/items.json'))

    // cba validare qua
    const result = jsonData.map((itemRaw) => {
        return itemSchema.parse({
            id: Number(itemRaw.itemId),
            name: itemRaw.name,
            ilvlMythic: Number(itemRaw.mythicLevel) ?? null,
            ilvlHeroic: Number(itemRaw.heroicLevel) ?? null,
            ilvlNormal: Number(itemRaw.normalLevel) ?? null,
            bonusId: itemRaw.bonusId,
            itemClass: itemRaw.itemClass,
            slot: itemRaw.slot,
            itemSubclass: itemRaw.itemSubclass,
            tierPrefix: itemRaw.tierPrefix,
            tier: 'Token' === itemRaw.itemSubclass,
            veryRare: 'Very Rare' === itemRaw.bonusId,
            specs: itemRaw.specs,
            specIds: itemRaw.specIds,
            classes: itemRaw.classes,
            classesId: itemRaw.classesId,
            stats: itemRaw.stats,
            mainStats: itemRaw.mainStats,
            secondaryStats: itemRaw.secondaryStats,
            wowheadUrl: itemRaw.wowheadUrl,
            iconName: itemRaw.iconName,
            iconUrl: itemRaw.iconUrl,
            bossName: itemRaw.bossName,
            bossId: itemRaw.journalEncounterID
        })
    })

    return result
}

export const fetchRaidBosses = async (): Promise<Boss[]> => {
    const jsonData = require(path.join(__dirname, '../../resources/wow/bosses.json'))
    return z.array(bossSchema).parse(jsonData)
}
