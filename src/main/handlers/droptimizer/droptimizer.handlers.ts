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
import { getDroptimizerFromURL as fetchDroptimizerFromURL } from './droptimizer.utils'
import { fetchDroptimizerFromQELiveURL } from './qelive.utils'

export const addSimulationHandler = async (url: string): Promise<void> => {
    console.log('Adding simulation from url', url)

    if (url.startsWith('https://questionablyepic.com/live/upgradereport/')) {
        // QE Live report: healers
        const droptimizers: NewDroptimizer[] = await fetchDroptimizerFromQELiveURL(url)
        await Promise.all(droptimizers.map(addDroptimizer))
        console.log('====')
    } else if (url.startsWith('https://www.raidbots.com/simbot/')) {
        // If the URL is a Raidbots simbot, fetch it
        const droptimizer: NewDroptimizer = await fetchDroptimizerFromURL(url)
        await addDroptimizer(droptimizer)
        console.log('====')
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

export const syncDroptimizersFromDiscord = async (hours: number): Promise<void> => {
    const botKey = await getConfig('DISCORD_BOT_TOKEN')
    const channelId = '1283383693695778878' // #droptimizers-drop

    if (botKey === null) {
        throw new Error('DISCORD_BOT_TOKEN not set in database')
    }

    const messages = await readAllMessagesInDiscord(botKey, channelId)
    const raidbotsUrlRegex = /https:\/\/www\.raidbots\.com\/simbot\/report\/([a-zA-Z0-9]+)/g

    const upperBound = getUnixTimestamp() - hours * 60 * 60
    const lowerBoundDate = new Date(upperBound * 1000)

    const uniqueUrls = new Set(
        messages
            .filter(msg => msg.createdAt >= lowerBoundDate) // filter out messages older than lowerBoundDate
            .flatMap(message => {
                const matches = message.content.match(raidbotsUrlRegex)
                return matches ? matches : []
            })
    )

    console.log(`Found ${uniqueUrls.size} unique valid Raidbots URLs since ${lowerBoundDate}`)

    // TODO: dynamically importing p-limit is not the best practice probably
    const { default: pLimit } = await import('p-limit')

    const limit = pLimit(5) // TODO: probably increase this

    await Promise.all(
        Array.from(uniqueUrls).map(url =>
            limit(async () => {
                try {
                    const droptimizer = await fetchDroptimizerFromURL(url)
                    // TODO: manage batch insertion instead of doing it one by one
                    await addDroptimizer(droptimizer)
                } catch (error) {
                    console.error(`Failed to add droptimizer for URL: ${url}`, error)
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
