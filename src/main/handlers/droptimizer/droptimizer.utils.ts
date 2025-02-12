import { parseItemTrack } from '@shared/libs/items/item-bonus-utils'
import { equippedSlotToSlot } from '@shared/libs/items/item-slot-utils'
import { gearItemSchema } from '@shared/schemas/items.schema'
import { wowItemEquippedSlotKeySchema, wowItemSlotKeySchema } from '@shared/schemas/wow.schemas'
import type { GearItem, RaidbotsURL, WowItemSlotKey } from '@shared/types/types'
import { z } from 'zod'
import {
    droptimizerEquippedItemSchema,
    droptimizerEquippedItemsSchema,
    raidbotParseAndTransform
} from './droptimizer.schemas'

export const fetchRaidbotsData = async (url: RaidbotsURL): Promise<unknown> => {
    const responseJson = await fetch(`${url}/data.json`)
    if (!responseJson.ok) {
        const errorMessage = `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    }
    return await responseJson.json()
}

export const parseRaidbotsData = (jsonData: any): z.infer<typeof raidbotParseAndTransform> => {
    if (jsonData?.simbot?.publicTitle === 'Top Gear') {
        throw new Error(
            `Skipping invalid droptimizer for ${jsonData.simbot.player} (Top Gear): ${jsonData.simbot.parentSimId}`
        )
    }
    return raidbotParseAndTransform.parse(jsonData)
}

export const parseGreatVaultFromSimc = (simc: string): GearItem[] => {
    const rewardSectionRegex =
        /### Weekly Reward Choices\n([\s\S]*?)\n### End of Weekly Reward Choices/
    const match = simc.match(rewardSectionRegex)

    if (!match) return []

    const items: GearItem[] = []
    const itemRegex = /# .*?\((\d+)\)\n#.*?id=(\d+),bonus_id=([\d/]+)/g
    let itemMatch: string[] | null

    while ((itemMatch = itemRegex.exec(match[1])) !== null) {
        const bonusString = itemMatch[3].replaceAll('/', ':')
        items.push({
            item: {
                id: parseInt(itemMatch[2], 10)
                //baseItemLevel: null,
                //slotKey: null
            },
            source: 'great-vault',
            itemLevel: parseInt(itemMatch[1], 10),
            bonusString: bonusString,
            itemTrack: parseItemTrack(bonusString)
        })
    }

    return items
}

export function parseBagGearsFromSimc(simc: string): GearItem[] | null {
    // Extract "Gear from Bags" section
    const gearSectionMatch = simc.match(/Gear from Bags[\s\S]*?(?=\n\n|$)/)
    if (!gearSectionMatch) {
        console.log("Unable to find 'Gear from Bags' section.")
        return null
    }

    const gearSection = gearSectionMatch[0]
    const itemLines = gearSection.split('\n').filter((line) => line.includes('='))

    const items: GearItem[] = []

    for (const line of itemLines) {
        const slotMatch = line.match(/^# ([a-zA-Z_]+\d?)=/)
        const itemIdMatch = line.match(/,id=(\d+)/)
        const enchantIdMatch = line.match(/enchant_id=([\d/]+)/)
        const gemIdMatch = line.match(/gem_id=([\d/]+)/)
        const bonusIdMatch = line.match(/bonus_id=([\d/]+)/)
        const craftedStatsMatch = line.match(/crafted_stats=([\d/]+)/)
        const craftingQualityMatch = line.match(/crafting_quality=([\d/]+)/)

        if (slotMatch && itemIdMatch && bonusIdMatch) {
            const bonusString = bonusIdMatch[1].replaceAll('/', ':')
            const item: GearItem = gearItemSchema.parse({
                item: {
                    id: parseInt(itemIdMatch[1], 10),
                    slotKey: wowItemSlotKeySchema.parse(
                        slotMatch[1].replaceAll('1', '') // somehow the slot is sometimes finger1 instead of finger
                    )
                },
                source: 'bag',
                bonusString: bonusString, // bonus is mandatory or is a trash item
                itemTrack: parseItemTrack(bonusString)
            } as GearItem)
            if (enchantIdMatch) item.enchantId = enchantIdMatch[1].replaceAll('/', ':')
            if (gemIdMatch) item.gemId = gemIdMatch[1].replaceAll('/', ':')
            if (craftedStatsMatch) item.craftedStats = craftedStatsMatch[1]
            if (craftingQualityMatch) item.craftingQuality = craftingQualityMatch[1]

            items.push(item)
        }
    }

    return items
}

export const parseEquippedGear = (
    droptEquipped: z.infer<typeof droptimizerEquippedItemsSchema>
): GearItem[] => {
    const res = Object.entries(droptEquipped).map(([slot, gearItem]) => {
        let realSlot = slot

        if (slot === 'mainHand') realSlot = 'main_hand'
        else if (slot === 'offHand') realSlot = 'off_hand'

        return gearItemSchema.parse({
            item: {
                id: gearItem.id,
                name: gearItem.name,
                slotKey: equippedSlotToSlot(wowItemEquippedSlotKeySchema.parse(realSlot))
            },
            source: 'equipped',
            equippedInSlot: realSlot,
            itemLevel: gearItem.itemLevel,
            bonusString: gearItem.bonus_id,
            itemTrack: gearItem.bonus_id ? parseItemTrack(gearItem.bonus_id) : undefined
        } as GearItem)
    })
    return res
}

export const droptimizerEquippedItemSchemaToGearItem = (
    slot: WowItemSlotKey,
    droptItem: z.infer<typeof droptimizerEquippedItemSchema> | undefined
): GearItem | undefined => {
    if (!droptItem) return undefined

    const res = gearItemSchema.parse({
        item: {
            id: droptItem.id,
            name: droptItem.name,
            slotKey: slot
        },
        source: 'equipped',
        itemLevel: droptItem.itemLevel,
        bonusString: droptItem.bonus_id
    } as GearItem)

    return res
}
