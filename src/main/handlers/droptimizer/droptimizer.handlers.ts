import { gearItemSchema } from '@shared/schemas/items.schema'
import { raidbotsURLSchema } from '@shared/schemas/simulations.schemas'
import type {
    Droptimizer,
    DroptimizerEquippedItems,
    GearItem,
    Item,
    ItemToCatalyst,
    ItemToTierset,
    NewDroptimizer,
    NewDroptimizerUpgrade,
    WowItemSlotKey,
    WowRaidDifficulty
} from '@shared/types/types'
import {
    addDroptimizer,
    deleteDroptimizer,
    getDroptimizerLastByCharAndDiff,
    getDroptimizerLatestList,
    getDroptimizerList,
    getItemToCatalystMapping,
    getItemToTiersetMapping
} from '@storage/droptimizer/droptimizer.storage'
import { getTiersetAndTokenList } from '@storage/items/items.storage'
import { getConfig } from '@storage/settings/settings.storage'
import { getUnixTimestamp } from '@utils'
import { readAllMessagesInDiscord } from '../../lib/discord/discord'
import { fetchRaidbotsData, parseRaidbotsData } from './droptimizer.utils'

// Static cache variables
let cachedItemsToTiersetMapping: ItemToTierset[]
let cachedItemsToCatalystMapping: ItemToCatalyst[]
let cachedTierset: Item[]

const ensureMappingsLoaded = async () => {
    if (!cachedItemsToTiersetMapping) {
        cachedItemsToTiersetMapping = await getItemToTiersetMapping()
    }
    if (!cachedItemsToCatalystMapping) {
        cachedItemsToCatalystMapping = await getItemToCatalystMapping()
    }
    if (!cachedTierset) {
        cachedTierset = await getTiersetAndTokenList()
    }
}

const evalUpgrades = (
    upgrades: {
        dps: number
        encounterId: number
        itemId: number
        ilvl: number
        slot: string
    }[]
): NewDroptimizerUpgrade[] => {
    const upgradesMap = upgrades
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
                    itemId: catalystMapping.itemId, // itemId looted by boss
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

    return Array.from(upgradesMap.values())
}

const evalTiersets = (equipped: DroptimizerEquippedItems, bags: GearItem[]): GearItem[] => {
    const res: GearItem[] = []

    const addTiersetInfo = (
        equippedGear: DroptimizerEquippedItems[keyof DroptimizerEquippedItems],
        slot: WowItemSlotKey
    ) => {
        if (!equippedGear) return
        const match = cachedTierset.find((t) => t.id === equippedGear.item.id) ?? null
        if (match != null) {
            res.push(
                gearItemSchema.parse({
                    item: {
                        id: equippedGear.item.id,
                        slotKey: slot,
                        baseItemLevel: match.ilvlBase
                    },
                    source: 'equipped',
                    itemLevel: equippedGear.itemLevel,
                    bonusString: equippedGear.bonusString
                } as GearItem)
            )
        }
    }

    addTiersetInfo(equipped.head, 'head')
    addTiersetInfo(equipped.shoulder, 'shoulder')
    addTiersetInfo(equipped.chest, 'chest')
    addTiersetInfo(equipped.hands, 'hands')
    addTiersetInfo(equipped.legs, 'legs')

    bags.map((bagItem) => {
        const match = cachedTierset.find((t) => t.id === bagItem.item.id)
        if (match != null) {
            res.push(
                gearItemSchema.parse({
                    item: { id: match.id, slotKey: match.slotKey, baseItemLevel: match.ilvlBase },
                    source: 'bag',
                    bonusString: bagItem.bonusString
                } as GearItem)
            )
        }
    })

    return res
}

export const addDroptimizerHandler = async (url: string): Promise<Droptimizer> => {
    console.log('Adding droptimizer from url', url)

    const raidbotsURL = raidbotsURLSchema.parse(url)
    const jsonData = await fetchRaidbotsData(raidbotsURL)
    const parsedJson = parseRaidbotsData(jsonData)

    await ensureMappingsLoaded()

    const droptimizer: NewDroptimizer = {
        ak: `${parsedJson.raidInfo.id},${parsedJson.raidInfo.difficulty},${parsedJson.charInfo.name},${parsedJson.charInfo.server},${parsedJson.charInfo.spec},${parsedJson.charInfo.class}`,
        url,
        charInfo: parsedJson.charInfo,
        raidInfo: parsedJson.raidInfo,
        simInfo: parsedJson.simInfo,
        dateImported: getUnixTimestamp(),
        upgrades: evalUpgrades(parsedJson.upgrades),
        currencies: parsedJson.currencies,
        weeklyChest: parsedJson.weeklyChest,
        itemsAverageItemLevel: parsedJson.itemsAverageItemLevel,
        itemsAverageItemLevelEquipped: parsedJson.itemsAverageItemLevelEquipped,
        itemsEquipped: parsedJson.itemsEquipped,
        itemsInBag: parsedJson.itemsInBag,
        tiersetInfo: evalTiersets(parsedJson.itemsEquipped, parsedJson.itemsInBag ?? [])
    }

    return await addDroptimizer(droptimizer)
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
            console.log(`Successfully added droptimizer for URL: ${url}`)
        } catch (error) {
            console.error(`Failed to add droptimizer for URL: ${url}`, error)
        }
    }
}
