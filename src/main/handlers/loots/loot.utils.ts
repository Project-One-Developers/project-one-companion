import { PROFESSION_TYPES } from '@shared/consts/wow.consts'
import {
    doesItemHaveSocket,
    getItemBonusString,
    parseItemString
} from '@shared/libs/item-string-parser/item-string-parser'
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
            // thirdStat: doesItemHaveTertiaryStat(parsedItem),
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
