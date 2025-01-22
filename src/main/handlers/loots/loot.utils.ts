import { PROFESSION_TYPES } from '@shared/consts/wow.consts'
import { newLootSchema } from '@shared/schemas/loot.schema'
import { NewLoot, WowRaidDifficulty } from '@shared/types/types'
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

interface ItemInfo {
    itemID: number
    enchantID: number
    gemIDs: number[]
    suffixID: number
    uniqueID: number
    linkLevel: number
    specializationID: number
    modifiersMask: number
    itemContext: number
    bonusIDs: number[]
    modifiers: { type: number; value: number }[]
    //relics: number[][]
    crafterGUID: number
    extraEnchantID: number
}

function parseItemString(itemString: string): ItemInfo {
    const parts = itemString.split(':').map(Number)

    return {
        itemID: parts[1],
        enchantID: parts[2],
        gemIDs: parts.slice(3, 7),
        suffixID: parts[7],
        uniqueID: parts[8],
        linkLevel: parts[9],
        specializationID: parts[10],
        modifiersMask: parts[11],
        itemContext: parts[12],
        bonusIDs: parts.slice(14, 14 + parts[13]),
        modifiers: Array.from({ length: parts[14 + parts[13]] }, (_, i) => ({
            type: parts[15 + parts[13] + i * 2],
            value: parts[16 + parts[13] + i * 2]
        })),
        // relics: [
        //     parts.slice(15 + parts[13] * 2 + 1, 15 + parts[13] * 2 + 1 + parts[15 + parts[13] * 2]),
        //     parts.slice(
        //         15 + parts[13] * 2 + 2 + parts[15 + parts[13] * 2],
        //         15 + parts[13] * 2 + 2 + parts[15 + parts[13] * 2] + parts[15 + parts[13] * 2 + 1]
        //     ),
        //     parts.slice(
        //         15 + parts[13] * 2 + 3 + parts[15 + parts[13] * 2] + parts[15 + parts[13] * 2 + 1]
        //     )
        // ],
        crafterGUID: parts[parts.length - 2],
        extraEnchantID: parts[parts.length - 1]
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

    const loots = rawRecords.map((record): NewLoot => {
        const parsedItem = parseItemString(record.itemString)
        return newLootSchema.parse({
            dropDate: parseDateTime(record.date, record.time),
            bonusString: parsedItem.bonusIDs.join(':'),
            itemString: record.itemString,
            thirdStat: record.itemString.includes('+3'),
            socket: parsedItem.bonusIDs.includes(10397), // 10397 = 1 socket
            raidDifficulty: parseWowDiff(record.difficultyID),
            itemId: record.itemID,
            rclootId: record.id
        })
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
