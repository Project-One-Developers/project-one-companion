import { bossSchema } from '@shared/schemas/boss.schema'
import { itemSchema, itemToCatalystSchema, itemToTiersetSchema } from '@shared/schemas/items.schema'
import type { Boss, Item, ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { readFileSync } from 'fs'
import * as path from 'path'
import { z } from 'zod'

export const fetchRaidItems = (season: number): Item[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, `../../resources/wow/s${season}/items.json`), 'utf-8')
    )

    // cba validare qua
    const transformRawItem = (itemRaw: any): Item => ({
        id: Number(itemRaw.itemId),
        name: itemRaw.name,
        ilvlBase: Number(itemRaw.mythicLevel),
        ilvlMythic: Number(itemRaw.mythicLevel),
        ilvlHeroic: Number(itemRaw.heroicLevel),
        ilvlNormal: Number(itemRaw.normalLevel),
        boe: itemRaw.boe,
        itemClass: itemRaw.itemClass,
        slot: itemRaw.slot,
        slotKey: itemRaw.slotKey,
        armorType: itemRaw.armorType,
        itemSubclass: itemRaw.itemSubclass,
        token: itemRaw.token,
        tokenPrefix: itemRaw.tokenPrefix,
        tierset: itemRaw.tierset,
        tiersetPrefix: itemRaw.tiersetPrefix,
        veryRare: itemRaw.veryRare,
        catalyzed: itemRaw.catalyst,
        specs: itemRaw.specs?.split(',') ?? null,
        specIds: itemRaw.specIds?.split('|').map(Number) ?? null,
        classes: itemRaw.classes?.split(',') ?? null,
        classesId: itemRaw.classesId?.split('|').map(Number) ?? null,
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
        onUseTrinket: itemRaw.onUseTrinket,
        season: itemRaw.season
    })

    return z.array(itemSchema).parse(jsonData.map(transformRawItem))
}

export const fetchNonRaidItems = (): Item[] => {
    const res: Item[] = []

    res.push({
        id: 228411,
        name: "Cyrce's Circlet",
        ilvlBase: 619,
        ilvlMythic: 619,
        ilvlHeroic: 619,
        ilvlNormal: 619,
        boe: false,
        slot: 'Finger',
        slotKey: 'finger',
        itemSubclass: null,
        token: false,
        tokenPrefix: null,
        tierset: false,
        tiersetPrefix: null,
        veryRare: false,
        catalyzed: false,
        specs: null,
        specIds: null,
        classes: null,
        classesId: null,
        stats: null,
        mainStats: null,
        secondaryStats: null,
        itemClass: 'Armor',
        armorType: null,
        wowheadUrl: 'https://www.wowhead.com/item=228411/cyrces-circlet',
        iconName: 'inv_siren_isle_ring',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_siren_isle_ring.jpg',
        bossName: 'Jewelcrafting', // non è vero
        bossId: -37, // non è vero
        sourceId: -66, // non è vero
        sourceName: 'Professions - Epic',
        sourceType: 'profession593',
        onUseTrinket: false,
        season: 1
    })

    res.push({
        id: 242664,
        name: 'Durable Information Securing Container',
        ilvlBase: 691,
        ilvlMythic: 691,
        ilvlHeroic: 691,
        ilvlNormal: 691,
        boe: false,
        slot: 'Waist',
        slotKey: 'waist',
        itemSubclass: null,
        token: false,
        tokenPrefix: null,
        tierset: false,
        tiersetPrefix: null,
        veryRare: false,
        catalyzed: false,
        specs: null,
        specIds: null,
        classes: null,
        classesId: null,
        stats: null,
        mainStats: null,
        secondaryStats: null,
        itemClass: 'Armor',
        armorType: 'Cloth',
        wowheadUrl: 'https://www.wowhead.com/item=242664/durable-information-securing-container',
        iconName: 'inv_armor_waistoftime_d_01_belt_titan-copy',
        iconUrl:
            'https://wow.zamimg.com/images/wow/icons/large/inv_armor_waistoftime_d_01_belt_titan-copy.jpg',
        bossName: 'Jewelcrafting', // non è vero
        bossId: -37, // non è vero
        sourceId: -66, // non è vero
        sourceName: 'Professions - Epic',
        sourceType: 'profession593',
        onUseTrinket: false,
        season: 1
    })

    res.push({
        id: 245964,
        name: 'Durable Information Securing Container',
        ilvlBase: 691,
        ilvlMythic: 691,
        ilvlHeroic: 691,
        ilvlNormal: 691,
        boe: false,
        slot: 'Waist',
        slotKey: 'waist',
        itemSubclass: null,
        token: false,
        tokenPrefix: null,
        tierset: false,
        tiersetPrefix: null,
        veryRare: false,
        catalyzed: false,
        specs: null,
        specIds: null,
        classes: null,
        classesId: null,
        stats: null,
        mainStats: null,
        secondaryStats: null,
        itemClass: 'Armor',
        armorType: 'Leather',
        wowheadUrl: 'https://www.wowhead.com/item=245964/durable-information-securing-container',
        iconName: 'inv_armor_waistoftime_d_01_belt_titan-copy',
        iconUrl:
            'https://wow.zamimg.com/images/wow/icons/large/inv_armor_waistoftime_d_01_belt_titan-copy.jpg',
        bossName: 'Jewelcrafting', // non è vero
        bossId: -37, // non è vero
        sourceId: -66, // non è vero
        sourceName: 'Professions - Epic',
        sourceType: 'profession593',
        onUseTrinket: false,
        season: 1
    })

    res.push({
        id: 245965,
        name: 'Durable Information Securing Container',
        ilvlBase: 691,
        ilvlMythic: 691,
        ilvlHeroic: 691,
        ilvlNormal: 691,
        boe: false,
        slot: 'Waist',
        slotKey: 'waist',
        itemSubclass: null,
        token: false,
        tokenPrefix: null,
        tierset: false,
        tiersetPrefix: null,
        veryRare: false,
        catalyzed: false,
        specs: null,
        specIds: null,
        classes: null,
        classesId: null,
        stats: null,
        mainStats: null,
        secondaryStats: null,
        itemClass: 'Armor',
        armorType: 'Mail',
        wowheadUrl: 'https://www.wowhead.com/item=245965/durable-information-securing-container',
        iconName: 'inv_armor_waistoftime_d_01_belt_titan-copy',
        iconUrl:
            'https://wow.zamimg.com/images/wow/icons/large/inv_armor_waistoftime_d_01_belt_titan-copy.jpg',
        bossName: 'Jewelcrafting', // non è vero
        bossId: -37, // non è vero
        sourceId: -66, // non è vero
        sourceName: 'Professions - Epic',
        sourceType: 'profession593',
        onUseTrinket: false,
        season: 1
    })

    res.push({
        id: 245966,
        name: 'Durable Information Securing Container',
        ilvlBase: 691,
        ilvlMythic: 691,
        ilvlHeroic: 691,
        ilvlNormal: 691,
        boe: false,
        slot: 'Waist',
        slotKey: 'waist',
        itemSubclass: null,
        token: false,
        tokenPrefix: null,
        tierset: false,
        tiersetPrefix: null,
        veryRare: false,
        catalyzed: false,
        specs: null,
        specIds: null,
        classes: null,
        classesId: null,
        stats: null,
        mainStats: null,
        secondaryStats: null,
        itemClass: 'Armor',
        armorType: 'Plate',
        wowheadUrl: 'https://www.wowhead.com/item=245966/durable-information-securing-container',
        iconName: 'inv_armor_waistoftime_d_01_belt_titan-copy',
        iconUrl:
            'https://wow.zamimg.com/images/wow/icons/large/inv_armor_waistoftime_d_01_belt_titan-copy.jpg',
        bossName: 'Jewelcrafting', // non è vero
        bossId: -37, // non è vero
        sourceId: -66, // non è vero
        sourceName: 'Professions - Epic',
        sourceType: 'profession593',
        onUseTrinket: false,
        season: 1
    })

    return res
}

export const fetchRaidBosses = (season: number): Boss[] => {
    const jsonData = JSON.parse(
        readFileSync(path.join(__dirname, `../../resources/wow/s${season}/bosses.json`), 'utf-8')
    )

    return z.array(bossSchema).parse(jsonData)
}

export const fetchItemsToTierset = (season: number): ItemToTierset[] => {
    const jsonData = JSON.parse(
        readFileSync(
            path.join(__dirname, `../../resources/wow/s${season}/items_to_tierset.json`),
            'utf-8'
        )
    )

    return z.array(itemToTiersetSchema).parse(jsonData)
}

export const fetchItemsToCatalyst = (season: number): ItemToCatalyst[] => {
    const jsonData = JSON.parse(
        readFileSync(
            path.join(__dirname, `../../resources/wow/s${season}/items_to_catalyst.json`),
            'utf-8'
        )
    )

    return z.array(itemToCatalystSchema).parse(jsonData)
}
