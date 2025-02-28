import { raidbotsURLSchema } from '@shared/schemas/simulations.schemas'
import type { Droptimizer, WowRaidDifficulty } from '@shared/types/types'
import {
    addDroptimizer,
    deleteDroptimizer,
    getDroptimizerLastByCharAndDiff,
    getDroptimizerLatestList,
    getDroptimizerList
} from '@storage/droptimizer/droptimizer.storage'
import { getConfig } from '@storage/settings/settings.storage'
import { readAllMessagesInDiscord } from '../../lib/discord/discord'
import { convertJsonToDroptimizer, fetchRaidbotsData, parseRaidbotsData } from './droptimizer.utils'

export const addDroptimizerHandler = async (url: string): Promise<Droptimizer> => {
    console.log('Adding droptimizer from url', url)

    const raidbotsURL = raidbotsURLSchema.parse(url)
    const jsonData = await fetchRaidbotsData(raidbotsURL)
    const parsedJson = parseRaidbotsData(jsonData)

    const droptimizer = await convertJsonToDroptimizer(url, parsedJson)

    const addedDropt = await addDroptimizer(droptimizer)

    console.log('====')

    return addedDropt
}

export const getDroptimizerListHandler = async (): Promise<Droptimizer[]> => {
    return await getDroptimizerList()
}

export const getDroptimizerLatestListHandler = async (): Promise<Droptimizer[]> => {
    return await getDroptimizerLatestList()
}

export const deleteDroptimizerHandler = async (url: string): Promise<void> => {
    return await deleteDroptimizer(url)
}

export const getDroptimizerLastByCharAndDiffHandler = async (
    charName: string,
    charRealm: string,
    raidDiff: WowRaidDifficulty
): Promise<Droptimizer | null> => {
    return await getDroptimizerLastByCharAndDiff(charName, charRealm, raidDiff)
}

export const syncDroptimizersFromDiscord = async (): Promise<void> => {
    const botKey = await getConfig('DISCORD_BOT_TOKEN')
    const channelId = '1283383693695778878' // #droptimizers-drop

    if (botKey === null) {
        throw new Error('DISCORD_BOT_TOKEN not set in database')
    }

    const messages = await readAllMessagesInDiscord(botKey, channelId)
    const raidbotsUrlRegex = /https:\/\/www\.raidbots\.com\/simbot\/report\/([a-zA-Z0-9]+)/g

    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const uniqueUrls = new Set(
        messages
            .filter((msg) => msg.createdAt >= twoWeeksAgo) // filter out messages older than 2 weeks
            .flatMap((message) => {
                const matches = message.content.match(raidbotsUrlRegex)
                return matches ? matches : []
            })
    )

    console.log(`Found ${uniqueUrls.size} unique valid Raidbots URLs in the last 2 weeks`)

    for (const url of uniqueUrls) {
        try {
            await addDroptimizerHandler(url)
        } catch (error) {
            console.error(`Failed to add droptimizer for URL: ${url}`, error)
        }
    }
}
