import { match } from 'ts-pattern'
import { z } from 'zod'
import { csvDataSchema, jsonDataSchema } from './droptimizer.schemas'

export const fetchRaidbotsData = async (
    url: string
): Promise<{ csvData: string; jsonData: unknown }> => {
    const [responseCsv, responseJson] = await Promise.all([
        fetch(`${url}/data.csv`),
        fetch(`${url}/data.json`)
    ])

    const errorMessage = match([responseCsv.ok, responseJson.ok])
        .with(
            [false, true],
            () => `Failed to fetch CSV data: ${responseCsv.status} ${responseCsv.statusText}`
        )
        .with(
            [true, false],
            () => `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        )
        .with([false, false], () =>
            [
                `Failed to fetch CSV data: ${responseCsv.status} ${responseCsv.statusText}`,
                `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
            ].join('\n')
        )
        .with([true, true], () => null)
        .exhaustive()

    if (errorMessage) {
        console.log(errorMessage)
        throw new Error(errorMessage)
    }

    const [csvData, jsonData] = await Promise.all([responseCsv.text(), responseJson.json()])

    return { csvData, jsonData }
}

export const parseRaidbotsData = (
    csvData: string,
    jsonData: unknown
): {
    parsedCsv: z.infer<typeof csvDataSchema>
    parsedJson: z.infer<typeof jsonDataSchema>
} => {
    const parsedCsv = csvDataSchema.parse(csvData)
    const parsedJson = jsonDataSchema.parse(jsonData)

    return { parsedCsv, parsedJson }
}
