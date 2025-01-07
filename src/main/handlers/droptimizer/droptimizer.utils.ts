import type { RaidbotsURL } from '@shared/types/types'
import { z } from 'zod'
import { jsonDataSchema } from './droptimizer.schemas'

export const fetchRaidbotsData = async (url: RaidbotsURL): Promise<unknown> => {
    const responseJson = await fetch(`${url}/data.json`)
    if (!responseJson.ok) {
        const errorMessage = `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    }
    return await responseJson.json()
}

export const parseRaidbotsData = (jsonData: unknown): z.infer<typeof jsonDataSchema> => {
    return jsonDataSchema.parse(jsonData)
}
