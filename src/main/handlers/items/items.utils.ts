import { readFileSync } from 'fs'
import * as path from 'path'
import { z } from 'zod'
import { bossSchema, itemSchema } from '../../../../shared/schemas'
import { Boss, Item } from '../../../../shared/types'

export const fetchRaidItems = async (): Promise<Item[]> => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/items.json'), 'utf-8')
    )

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
            tierPrefix: itemRaw.token,
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

    return z.array(itemSchema).parse(result)
}

export const fetchRaidBosses = async (): Promise<Boss[]> => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, '../../resources/wow/bosses.json'), 'utf-8')
    )

    return z.array(bossSchema).parse(jsonData)
}
