import { getBossesNames } from '@storage/bosses/bosses.storage'
import { newUUID } from '@utils'
import { parse } from 'papaparse'
import { z } from 'zod'
import {
    Loot,
    RaidSessionLoots,
    raidSessionLootsSchema,
    rawLootRecordSchema
} from './raid-session.schemas'

export const parseRaidSessionCsv = async (
    sessionId: string,
    csv: string
): Promise<RaidSessionLoots> => {
    const parsedData = parse(csv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    })

    if (!parsedData.data || parsedData.errors.length > 0) {
        console.log(parsedData.errors)
        throw new Error('Error during parsing RCLoot CSV:' + parsedData.errors[0])
    }

    const rawRecords = z.array(rawLootRecordSchema).parse(parsedData.data)

    // TODO: maybe instead of getting the boss, we can just check where the item ID loots
    // and then get the boss ID from that, this makes this consistent even if RC uses
    // slightly weird names
    const bosses = await getBossesNames()

    const loots = rawRecords.map((record): Loot => {
        const boss = bosses.find((boss) => boss.name === record.boss)
        if (!boss) {
            // TODO: are we sure RC boss names are the same as we have in the db?
            // can we improve this mapping to make it consistent?
            throw new Error(`Boss ${record.boss} not found`)
        }

        return {
            id: newUUID(),
            dropDate: new Date(`${record.date} ${record.time}`).getTime(), //TODO: what do we actually want to save here?
            socket: record.itemString.includes('Socket'),
            raidSessionId: sessionId,
            itemId: record.itemID,
            bossId: boss.id, // TODO: don't we already know where a specific loot drops?
            thirdStat: null, //TODO: implement?
            assignedTo: record.player.split('-')[0]
        }
    })

    return raidSessionLootsSchema.parse(loots)
}
