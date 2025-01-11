import { parseRaidSessionCsv } from './raid-session.utils'

export const loadRaidSessionCsvHandler = async (sessionId: string, csv: string): Promise<void> => {
    const parsedData = parseRaidSessionCsv(sessionId, csv)
    console.log(parsedData)

    // TODO: insertion
}
