import { PROFESSION_TYPES } from '@shared/consts/wow.consts'
import { newLootSchema } from '@shared/schemas/loot.schema'
import { NewLoot, WowRaidDifficulty } from '@shared/types/types'
import { parse } from 'papaparse'
import { z } from 'zod'
import { rawLootRecordSchema } from './raid-session.schemas'

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

    // TODO: maybe instead of getting the boss, we can just check where the item ID loots
    // and then get the boss ID from that, this makes this consistent even if RC uses
    // slightly weird names
    // const bosses = await getBossesNames()

    const loots = rawRecords.map((record): NewLoot => {
        // const boss = bosses.find((boss) => boss.name === record.boss)
        // if (!boss) {
        //     // TODO: are we sure RC boss names are the same as we have in the db?
        //     // can we improve this mapping to make it consistent?
        //     throw new Error(`Boss ${record.boss} not found`)
        // }

        return newLootSchema.parse({
            dropDate: parseDateTime(record.date, record.time), //TODO: what do we actually want to save here?
            socket: record.itemString.includes('Socket'),
            diff: parseWowDiff(record.difficultyID),
            itemId: record.itemID
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
