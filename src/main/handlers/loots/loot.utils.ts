import { PROFESSION_TYPES } from '@shared/consts/wow.consts'
import {
    doesItemHaveSocket,
    doesItemHaveTertiaryStat,
    getItemBonusString,
    parseItemString
} from '@shared/libs/items/item-string-parser'
import { newLootSchema } from '@shared/schemas/loot.schema'
import {
    BisList,
    Character,
    Droptimizer,
    DroptimizerUpgrade,
    GearItem,
    Item,
    LootWithItem,
    NewLoot,
    WowItemSlotKey,
    WowRaidDifficulty
} from '@shared/types/types'
import { parse } from 'papaparse'
import { z } from 'zod'
import { rawLootRecordSchema } from '../raid-session/raid-session.schemas'

const parseWowDiff = (wowDiff: number): WowRaidDifficulty => {
    switch (wowDiff) {
        case 14:
            return 'Normal'
        case 15:
            return 'Heroic'
        case 16:
            return 'Mythic'
        default:
            return 'Mythic'
    }
}

export const parseRaidSessionCsv = async (csv: string): Promise<NewLoot[]> => {
    const parsedData = parse(csv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    })

    if (!parsedData.data || parsedData.errors.length > 0) {
        console.log(parsedData.errors)
        throw new Error('Error during parsing RCLoot CSV:' + parsedData.errors[0])
    }

    const filteredData = parsedData.data.filter(
        (record) =>
            !PROFESSION_TYPES.has(record.subType) &&
            !record.response.toLowerCase().includes('personal loot')
    )

    const rawRecords = z.array(rawLootRecordSchema).parse(filteredData)

    const loots = rawRecords.map((record) => {
        const parsedItem = parseItemString(record.itemString)
        const { date, time, itemString, difficultyID, itemID, id } = record

        const loot: NewLoot = {
            dropDate: parseDateTime(date, time),
            bonusString: getItemBonusString(parsedItem),
            itemString,
            tertiaryStat: doesItemHaveTertiaryStat(parsedItem),
            socket: doesItemHaveSocket(parsedItem),
            raidDifficulty: parseWowDiff(difficultyID),
            itemId: itemID,
            rclootId: id
        }

        return newLootSchema.parse(loot)
    })

    return loots
}

const parseDateTime = (dateStr: string, timeStr: string): number => {
    // Split date components
    const [day, month, shortYear] = dateStr.split('/')

    // Convert 2-digit year to 4-digit (assuming 20xx for years 00-99)
    const fullYear = `20${shortYear}`

    // Create ISO format date string (yyyy-mm-ddTHH:mm:ss)
    const isoDateTime = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr}`

    const dateTime = new Date(isoDateTime)

    if (isNaN(dateTime.getTime())) {
        throw new Error(`Unable to parse date/time: ${dateStr} ${timeStr}`)
    }

    return dateTime.getTime() / 1000
}

export const parseBestItemInSlot = (
    slot: WowItemSlotKey | null,
    droptimizers: Droptimizer[]
): GearItem | null => {
    // slot null = omni token
    if (slot == null) return null

    const droptWithItem = droptimizers
        .filter((c) => c.itemsEquipped != null && c.itemsEquipped[slot] != null)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]

    return droptWithItem?.itemsEquipped[slot] ?? null
}

export const parseLootIsBis = (
    bisList: BisList[],
    loot: LootWithItem,
    char: Character
): boolean => {
    return bisList.some((bis) => {
        return bis.itemIds.includes(loot.item.id) && bis.wowClass === char.class
    })
}

/**
 * Todo: include assigned loot in the calculation
 * @param tiersetInfo
 * @returns
 */
export const parseTiersetInfo = (charDroptimizers: Droptimizer[]): GearItem[] => {
    const droptWithTierInfo = charDroptimizers
        .filter((c) => c.tiersetInfo != null && c.tiersetInfo.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]

    if (droptWithTierInfo == null) return []

    const maxItemLevelBySlot = new Map<string, GearItem>()

    droptWithTierInfo.tiersetInfo.forEach((gear) => {
        if (gear.item.slotKey) {
            const existingItem = maxItemLevelBySlot.get(gear.item.slotKey)

            let itemLevel = -1
            if (gear.itemLevel == null) {
                itemLevel = 1 // todo: parse from bonusString
            } else {
                itemLevel = gear.itemLevel
            }

            if (
                !existingItem ||
                (gear.itemLevel &&
                    (existingItem.itemLevel == null || itemLevel > existingItem.itemLevel))
            ) {
                maxItemLevelBySlot.set(gear.item.slotKey, { ...gear, itemLevel })
            }
        }
    })

    return [
        ...Array.from(maxItemLevelBySlot.values()), // tierset found
        ...droptWithTierInfo.tiersetInfo.filter((t) => t.item.slotKey === 'omni') // omni tokens
    ]
}

export const parseDroptimizersInfo = (
    lootItem: Item,
    raidDiff: WowRaidDifficulty,
    droptimizers: Droptimizer[]
): {
    upgrade: DroptimizerUpgrade | null
    itemEquipped: GearItem
    droptimizer: Droptimizer
}[] => {
    // todo: what to do when omni token?
    // we could take every tierset in upgrades and take the one with max gain

    return droptimizers
        .filter(({ raidInfo }) => raidInfo.difficulty === raidDiff)
        .map((droptimizer) => {
            const upgrade =
                droptimizer.upgrades?.find(({ item }) => item.id === lootItem.id) || null

            if (upgrade != null) {
                const itemEquipped = droptimizer.itemsEquipped[upgrade?.slot] || null
                return { upgrade, itemEquipped, droptimizer }
            }

            const itemEquipped = droptimizer.itemsEquipped[lootItem.slotKey] || null
            return { upgrade, itemEquipped, droptimizer }
        })
        .sort((a, b) => (b.upgrade?.dps || 0) - (a.upgrade?.dps || 0))
}

/**
 * // more recent droptimizer with weekly chest info
 * // todo: exclude if not in the current wow reset?
 * @param droptimizers
 * @returns
 */
export const parseWeeklyChest = (droptimizers: Droptimizer[]): GearItem[] => {
    return (
        droptimizers.filter((c) => c.weeklyChest).sort((a, b) => b.simInfo.date - a.simInfo.date)[0]
            ?.weeklyChest ?? []
    )
}
