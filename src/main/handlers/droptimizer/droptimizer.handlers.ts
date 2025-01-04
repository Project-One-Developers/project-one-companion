import { raidbotsURLSchema } from '@shared/schemas/simulations.schemas'
import type {
    Droptimizer,
    ItemToCatalyst,
    ItemToTierset,
    NewDroptimizer,
    NewDroptimizerUpgrade
} from '@shared/types/types'
import {
    addDroptimizer,
    getDroptimizerList,
    getItemToCatalystMapping,
    getItemToTiersetMapping
} from '@storage/droptimizer/droptimizer.storage'
import { fetchRaidbotsData, parseRaidbotsData } from './droptimizer.utils'

// Static cache variables
let cachedItemsToTiersetMapping: ItemToTierset[]
let cachedItemsToCatalystMapping: ItemToCatalyst[]

const ensureMappingsLoaded = async () => {
    if (!cachedItemsToTiersetMapping) {
        cachedItemsToTiersetMapping = await getItemToTiersetMapping()
    }
    if (!cachedItemsToCatalystMapping) {
        cachedItemsToCatalystMapping = await getItemToCatalystMapping()
    }
}

export const addDroptimizerHandler = async (url: string): Promise<Droptimizer> => {
    console.log('Adding droptimizer from url', url)

    const raidbotsURL = raidbotsURLSchema.parse(url)
    const { csvData, jsonData } = await fetchRaidbotsData(raidbotsURL)
    const { parsedCsv, parsedJson } = parseRaidbotsData(csvData, jsonData)

    await ensureMappingsLoaded()

    const upgradesMap = parsedCsv.upgrades
        // filter out item without dps gain
        .filter((item) => item.dps > 0)
        // remap itemid to tierset & catalyst
        .map((up) => {
            const tiersetMapping = cachedItemsToTiersetMapping.find((i) => i.itemId === up.itemId)
            const catalystMapping = !tiersetMapping
                ? cachedItemsToCatalystMapping.find(
                      (i) => i.catalyzedItemId === up.itemId && i.encounterId === up.encounterId
                  )
                : null

            const res: NewDroptimizerUpgrade = {
                itemId: tiersetMapping ? tiersetMapping.tokenId : up.itemId, // boss drops token id, not the specific tierset
                slot: up.slot,
                dps: up.dps,
                catalyzedItemId: null,
                ...(catalystMapping && {
                    itemId: catalystMapping.itemId, // itemId looted by boss
                    catalyzedItemId: up.itemId // itemId converted by catalyst
                })
            }

            return res
        })
        // for a given itemid upgrade, keep the max dps gain
        .reduce((acc, item) => {
            const existingItem = acc.get(item.itemId)
            if (!existingItem || item.dps > existingItem.dps) {
                acc.set(item.itemId, item)
            }
            return acc
        }, new Map<number, NewDroptimizerUpgrade>())

    const droptimizer: NewDroptimizer = {
        characterName: parsedCsv.characterName,
        raidDifficulty: parsedJson.difficulty,
        fightInfo: {
            fightstyle: parsedJson.fightStyle,
            duration: parsedJson.duration,
            nTargets: parsedJson.targets
        },
        url,
        resultRaw: csvData,
        date: parsedJson.date,
        upgrades: Array.from(upgradesMap.values())
    }

    return await addDroptimizer(droptimizer)
}

export const getDroptimizerListHandler = async (): Promise<Droptimizer[]> => {
    return await getDroptimizerList()
}
