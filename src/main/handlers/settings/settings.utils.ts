import { bossSchema } from '@shared/schemas/boss.schema'
import { itemSchema, itemToCatalystSchema, itemToTiersetSchema } from '@shared/schemas/items.schema'
import type { Boss, Item, ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { readFileSync } from 'fs'
import * as path from 'path'
import { z } from 'zod'

export const fetchRaidItems = (): Item[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/items.json'), 'utf-8')
    )

    // cba validare qua
    const transformRawItem = (itemRaw: any): Item => ({
        id: Number(itemRaw.itemId),
        name: itemRaw.name,
        ilvlMythic: Number(itemRaw.mythicLevel),
        ilvlHeroic: Number(itemRaw.heroicLevel),
        ilvlNormal: Number(itemRaw.normalLevel),
        boe: itemRaw.boe,
        itemClass: itemRaw.itemClass,
        slot: itemRaw.slot,
        armorType: itemRaw.armorType,
        itemSubclass: itemRaw.itemSubclass,
        tokenPrefix: itemRaw.token,
        tier: itemRaw.itemSubclass === 'Token',
        veryRare: itemRaw.bonusId === 'Very Rare',
        catalyzed: itemRaw.catalyst,
        specs: itemRaw.specs?.split(',') ?? null,
        specIds: itemRaw.specIds?.split('|') ?? null,
        classes: itemRaw.classes?.split(',') ?? null,
        classesId: itemRaw.classesId?.split('|') ?? null,
        stats: itemRaw.stats,
        mainStats: itemRaw.mainStats,
        secondaryStats: itemRaw.secondaryStats,
        wowheadUrl: itemRaw.wowheadUrl,
        iconName: itemRaw.iconName,
        iconUrl: itemRaw.iconUrl,
        bossName: itemRaw.journalEncounterName,
        bossId: itemRaw.journalEncounterID,
        sourceId: itemRaw.sourceId, // instance id (eg: raid id, profession id, mplus name)
        sourceName: itemRaw.sourceName,
        sourceType: itemRaw.sourceType,
        onUseTrinket: itemRaw.onUseTrinket
    })

    return z.array(itemSchema).parse(jsonData.map(transformRawItem))
}

export const fetchRaidBosses = (): Boss[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/bosses.json'), 'utf-8')
    )

    return z.array(bossSchema).parse(jsonData)
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
