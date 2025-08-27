import { getUnixTimestamp } from '@shared/libs/date/date-utils'
import type { Droptimizer, NewDroptimizer, WowRaidDifficulty } from '@shared/types/types'
import {
    addDroptimizer,
    deleteDroptimizer,
    deleteDroptimizerOlderThanDate,
    getDroptimizerLastByCharAndDiff,
    getDroptimizerLatestList,
    getDroptimizerList
} from '@storage/droptimizer/droptimizer.storage'
import { deleteSimcOlderThanDate } from '@storage/droptimizer/simc.storage'
import { getConfig } from '@storage/settings/settings.storage'
import { readAllMessagesInDiscord } from '../../lib/discord/discord'
import { fetchDroptimizerFromURL } from './droptimizer.utils'
import { fetchDroptimizerFromQELiveURL } from './qelive.utils'

export const addSimulationHandler = async (url: string): Promise<void> => {
    console.log('Adding simulation from url', url)

    if (url.startsWith('https://questionablyepic.com/live/upgradereport/')) {
        // QE Live report: healers
        const droptimizers: NewDroptimizer[] = await fetchDroptimizerFromQELiveURL(url)
        await Promise.all(droptimizers.map(addDroptimizer))
    } else if (url.startsWith('https://www.raidbots.com/simbot/')) {
        // If the URL is a Raidbots simbot, fetch it
        const droptimizer: NewDroptimizer = await fetchDroptimizerFromURL(url)
        await addDroptimizer(droptimizer)
    } else {
        throw new Error('Invalid URL format for droptimizer')
    }
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

const extractUrlsFromMessages = (
    messages: Array<{ content: string; createdAt: Date }>,
    lowerBoundDate: Date
): Set<string> => {
    const raidbotsUrlRegex = /https:\/\/www\.raidbots\.com\/simbot\/report\/([a-zA-Z0-9]+)/g
    const qeLiveUrlRegex = /https:\/\/questionablyepic\.com\/live\/upgradereport\/([a-zA-Z0-9-_]+)/g

    return new Set(
        messages
            .filter(msg => msg.createdAt >= lowerBoundDate)
            .flatMap(message => {
                const raidbotsMatches = message.content.match(raidbotsUrlRegex) || []
                const qeLiveMatches = message.content.match(qeLiveUrlRegex) || []
                return [...raidbotsMatches, ...qeLiveMatches]
            })
    )
}

export const syncDroptimizersFromDiscord = async (hours: number): Promise<void> => {
    const botKey = await getConfig('DISCORD_BOT_TOKEN')
    const channelId = '1283383693695778878' // #droptimizers-drop

    if (botKey === null) {
        throw new Error('DISCORD_BOT_TOKEN not set in database')
    }

    const messages = await readAllMessagesInDiscord(botKey, channelId)
    const upperBound = getUnixTimestamp() - hours * 60 * 60
    const lowerBoundDate = new Date(upperBound * 1000)

    const uniqueUrls = extractUrlsFromMessages(messages, lowerBoundDate)

    console.log(`Found ${uniqueUrls.size} unique valid URLs since ${lowerBoundDate}`)

    const { default: pLimit } = await import('p-limit')
    const limit = pLimit(5)

    await Promise.all(
        Array.from(uniqueUrls).map(url =>
            limit(async () => {
                try {
                    await addSimulationHandler(url)
                } catch (error) {
                    console.error(`Failed to add simulation for URL: ${url}`, error)
                }
            })
        )
    )

    console.log('All droptimizers imported successfully')
}

export const deleteSimulationsOlderThanHoursHandler = async (hours: number): Promise<void> => {
    const currentTimeStamp = getUnixTimestamp()
    const upperBound = currentTimeStamp - hours * 60 * 60
    await Promise.all([
        deleteDroptimizerOlderThanDate(upperBound),
        deleteSimcOlderThanDate(upperBound)
    ])
}
