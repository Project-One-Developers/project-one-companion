import {
    itemSchema,
    itemToCatalystSchema,
    itemToTiersetSchema,
    newBossSchema
} from '@shared/schemas/wow.schemas'
import type { Item, ItemToCatalyst, ItemToTierset, NewBoss } from '@shared/types/types'
import { readFileSync } from 'fs'
import * as path from 'path'
import { z } from 'zod'

export const fetchRaidItems = (): Item[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/items.json'), 'utf-8')
    )

    // cba validare qua
    const result = jsonData.map((itemRaw) => {
        return itemSchema.parse({
            id: Number(itemRaw.itemId),
            name: itemRaw.name,
            ilvlMythic: itemRaw.mythicLevel ? Number(itemRaw.mythicLevel) : null,
            ilvlHeroic: itemRaw.heroicLevel ? Number(itemRaw.heroicLevel) : null,
            ilvlNormal: itemRaw.normalLevel ? Number(itemRaw.normalLevel) : null,
            boe: itemRaw.boe,
            itemClass: itemRaw.itemClass,
            slot: itemRaw.slot,
            itemSubclass: itemRaw.itemSubclass,
            tierPrefix: itemRaw.token,
            tier: 'Token' === itemRaw.itemSubclass,
            veryRare: 'Very Rare' === itemRaw.bonusId,
            catalyzed: itemRaw.catalyst,
            specs: itemRaw.specs ? itemRaw.specs.split(',') : null,
            specIds: itemRaw.specIds ? String(itemRaw.specIds).split('|') : null,
            classes: itemRaw.classes ? itemRaw.classes.split(',') : null,
            classesId: itemRaw.classesId ? String(itemRaw.classesId).split('|') : null,
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

    return z.array(itemSchema).parse(result)
}

export const fetchRaidBosses = (): NewBoss[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/bosses.json'), 'utf-8')
    )

    return z.array(newBossSchema).parse(jsonData)
}

export const fetchItemsToTierset = (): ItemToTierset[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/items_to_tierset.json'), 'utf-8')
    )

    return z.array(itemToTiersetSchema).parse(jsonData)
}

export const fetchItemsToCatalyst = (): ItemToCatalyst[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/items_to_catalyst.json'), 'utf-8')
    )

    return z.array(itemToCatalystSchema).parse(jsonData)
}
