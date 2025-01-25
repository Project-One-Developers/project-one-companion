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

export const extractWeeklyRewardChoices = (
    text: string
): { id: number; bonusString: string; itemLevel: number }[] => {
    const rewardSectionRegex =
        /### Weekly Reward Choices\n([\s\S]*?)\n### End of Weekly Reward Choices/
    const match = text.match(rewardSectionRegex)

    if (!match) return []

    const items: { id: number; bonusString: string; itemLevel: number }[] = []
    const itemRegex = /# .*?\((\d+)\)\n#.*?id=(\d+),bonus_id=([\d\/]+)/g
    let itemMatch: string[] | null

    while ((itemMatch = itemRegex.exec(match[1])) !== null) {
        items.push({
            id: parseInt(itemMatch[2], 10),
            bonusString: itemMatch[3],
            itemLevel: parseInt(itemMatch[1], 10)
        })
    }

    return items
}
