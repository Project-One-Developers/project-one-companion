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
    deleteDroptimizer,
    getDroptimizerList,
    getItemToCatalystMapping,
    getItemToTiersetMapping
} from '@storage/droptimizer/droptimizer.storage'
import { getUnixTimestamp } from '@utils'
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
    const jsonData = await fetchRaidbotsData(raidbotsURL)
    const parsedJson = parseRaidbotsData(jsonData)

    await ensureMappingsLoaded()

    const upgradesMap = parsedJson.upgrades
        // filter out item without dps gain
        .filter((item) => item.dps > 0)
        // remap itemid to tierset & catalyst
        .map((up) => {
            // ci serve questo mapping perchè in data.csv è presente l'upgrade per l'itemid del pezzo del tierset finale (es: guanti warlock)
            // ma questo itemid non appartiene alla loot table del boss, che può lootare solo token per gruppi di classi
            const tiersetMapping = cachedItemsToTiersetMapping?.find((i) => i.itemId === up.itemId)

            // ci serve questo reverse lookup perchè in data.csv di droptimizer per un upgrade di tipo catalizzato è presente:
            // 1. l'item id finale dopo la trasformazione catalyst (che non appartiene alla loot table del boss)
            // 2. il boss encounter id dove esce l'item da catalizzare
            // tramite la tabella di mapping ItemToCatalyst riusciamo a ricavare l'item id "originale" della loot table del boss
            const catalystMapping = !tiersetMapping
                ? cachedItemsToCatalystMapping?.find(
                      (i) => i.catalyzedItemId === up.itemId && i.encounterId === up.encounterId
                  )
                : null

            const res: NewDroptimizerUpgrade = {
                itemId: tiersetMapping ? tiersetMapping.tokenId : up.itemId, // boss drops token id, not the specific tierset
                slot: up.slot,
                dps: up.dps,
                ilvl: up.ilvl,
                catalyzedItemId: null,
                ...(catalystMapping && {
                    itemId: catalystMapping.raidItemId, // itemId looted by boss
                    catalyzedItemId: catalystMapping.catalyzedItemId // itemId converted by catalyst
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
        ak: `${parsedJson.raidInfo.id},${parsedJson.raidInfo.difficulty},${parsedJson.charInfo.name},${parsedJson.charInfo.server},${parsedJson.charInfo.spec},${parsedJson.charInfo.class}`,
        url,
        charInfo: parsedJson.charInfo,
        raidInfo: parsedJson.raidInfo,
        simInfo: parsedJson.simInfo,
        dateImported: getUnixTimestamp(),
        upgrades: Array.from(upgradesMap.values())
    }

    return await addDroptimizer(droptimizer)
}

export const getDroptimizerListHandler = async (): Promise<Droptimizer[]> => {
    return await getDroptimizerList()
}

export const deleteDroptimizerHandler = async (url: string): Promise<void> => {
    return await deleteDroptimizer(url)
}
