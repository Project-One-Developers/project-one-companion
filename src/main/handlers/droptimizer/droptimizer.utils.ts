import { gearItemSchema } from '@shared/schemas/items.schema'
import { wowItemSlotKeySchema } from '@shared/schemas/wow.schemas'
import type { GearItem, RaidbotsURL, WowItemSlotKey } from '@shared/types/types'
import { z } from 'zod'
import { droptimizerEquippedItemSchema, raidbotParseAndTransform } from './droptimizer.schemas'

export const fetchRaidbotsData = async (url: RaidbotsURL): Promise<unknown> => {
    const responseJson = await fetch(`${url}/data.json`)
    if (!responseJson.ok) {
        const errorMessage = `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    }
    return await responseJson.json()
}

export const parseRaidbotsData = (jsonData: unknown): z.infer<typeof raidbotParseAndTransform> => {
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
        items.push({
            item: {
                id: parseInt(itemMatch[2], 10)
                //baseItemLevel: null,
                //slotKey: null
            },
            source: 'great-vault',
            itemLevel: parseInt(itemMatch[1], 10),
            bonusString: itemMatch[3].replaceAll('/', ':')
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
            const item: GearItem = gearItemSchema.parse({
                item: {
                    id: parseInt(itemIdMatch[1], 10),
                    slotKey: wowItemSlotKeySchema.parse(
                        slotMatch[1].replaceAll('1', '') // somehow the slot is sometimes finger1 instead of finger
                    )
                },
                source: 'bag',
                bonusString: bonusIdMatch[1].replaceAll('/', ':') // bonus is mandatory or is a trash item
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
