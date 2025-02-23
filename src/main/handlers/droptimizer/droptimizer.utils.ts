import { parseItemLevelFromBonusIds, parseItemTrack } from '@shared/libs/items/item-bonus-utils'
import { wowItemEquippedSlotKeySchema, wowRaidDiffSchema } from '@shared/schemas/wow.schemas'
import type {
    GearItem,
    Item,
    ItemTrack,
    NewDroptimizer,
    NewDroptimizerUpgrade,
    RaidbotsURL,
    WowClassName,
    WowItemEquippedSlotKey
} from '@shared/types/types'
import {
    getItems,
    getItemToCatalystMapping,
    getItemToTiersetMapping,
    getTiersetAndTokenList
} from '@storage/items/items.storage'
import { getUnixTimestamp } from '@utils'
import { z } from 'zod'
import {
    droptimizerEquippedItemsSchema,
    RaidbotJson,
    raidbotJsonSchema
} from './droptimizer.schemas'

export const fetchRaidbotsData = async (url: RaidbotsURL): Promise<unknown> => {
    const responseJson = await fetch(`${url}/data.json`)
    if (!responseJson.ok) {
        const errorMessage = `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    }
    return await responseJson.json()
}

export const parseRaidbotsData = (jsonData: any): RaidbotJson => {
    if (jsonData?.simbot?.publicTitle === 'Top Gear') {
        throw new Error(
            `Skipping invalid droptimizer for ${jsonData.simbot.player} (Top Gear): ${jsonData.simbot.parentSimId}`
        )
    }
    return raidbotJsonSchema.parse(jsonData)
}

const parseUpgrades = async (
    upgrades: {
        dps: number
        encounterId: number
        itemId: number
        ilvl: number
        slot: WowItemEquippedSlotKey
    }[]
): Promise<NewDroptimizerUpgrade[]> => {
    const itemToTiersetMapping = await getItemToTiersetMapping()
    const itemToCatalystMapping = await getItemToCatalystMapping()

    const upgradesMap = upgrades
        // filter out item without dps gain
        .filter((item) => item.dps > 0)
        // remap itemid to tierset & catalyst
        .map((up) => {
            // ci serve questo mapping perchè in data.csv è presente l'upgrade per l'itemid del pezzo del tierset finale (es: guanti warlock)
            // ma questo itemid non appartiene alla loot table del boss, che può lootare solo token per gruppi di classi
            const tiersetMapping = itemToTiersetMapping?.find((i) => i.itemId === up.itemId)

            // ci serve questo reverse lookup perchè in data.csv di droptimizer per un upgrade di tipo catalizzato è presente:
            // 1. l'item id finale dopo la trasformazione catalyst (che non appartiene alla loot table del boss)
            // 2. il boss encounter id dove esce l'item da catalizzare
            // tramite la tabella di mapping ItemToCatalyst riusciamo a ricavare l'item id "originale" della loot table del boss
            const catalystMapping = !tiersetMapping
                ? itemToCatalystMapping?.find(
                      (i) => i.catalyzedItemId === up.itemId && i.encounterId === up.encounterId
                  )
                : null

            const res: NewDroptimizerUpgrade = {
                itemId: up.itemId,
                slot: up.slot,
                dps: up.dps,
                ilvl: up.ilvl,
                catalyzedItemId: null,
                tiersetItemId: null,
                ...(tiersetMapping && {
                    itemId: tiersetMapping.tokenId, // boss drops token id, not the specific tierset
                    tiersetItemId: tiersetMapping.itemId // itemId converted by token
                }),
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

const parseTiersets = async (equipped: GearItem[], bags: GearItem[]): Promise<GearItem[]> => {
    const res: GearItem[] = []
    const tiersetItems = await getTiersetAndTokenList()

    const checkAndAddItem = (item: GearItem) => {
        const match = tiersetItems.find((t) => t.id === item.item.id)
        if (match != null) {
            res.push(item)
        }
    }

    equipped.forEach(checkAndAddItem)
    bags.forEach(checkAndAddItem)

    return res
}

export const convertJsonToDroptimizer = async (
    url: string,
    data: RaidbotJson
): Promise<NewDroptimizer> => {
    // transform
    const raidId = Number(data.sim.profilesets.results[0].name.split('/')[0])
    const raidDiff = wowRaidDiffSchema.parse(
        data.simbot.publicTitle.split('•')[2].replaceAll(' ', '')
    )
    const dpsMean = data.sim.players[0].collected_data.dps.mean
    const upgrades = data.sim.profilesets.results.map((item) => ({
        dps: Math.round(item.mean - dpsMean),
        encounterId: Number(item.name.split('/')[1]),
        itemId: Number(item.name.split('/')[3]),
        ilvl: Number(item.name.split('/')[4]),
        slot: wowItemEquippedSlotKeySchema.parse(item.name.split('/')[6])
    }))
    const charInfo = {
        name: data.simbot.meta.rawFormData.character.name,
        // non si capisce un cazzo: a volte arriva rng: pozzo-delleternità, pozzo dell'eternità, pozzo_dell'eternità
        server: data.simbot.meta.rawFormData.character.realm
            .toLowerCase()
            .replaceAll('_', '-')
            .replaceAll(' ', '-')
            .replaceAll("'", ''),
        class: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents
            .className as WowClassName,
        classId: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.classId,
        spec: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.specName,
        specId: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.specId,
        talents: data.sim.players[0].talents
    }

    const itemsEquipped = await parseEquippedGear(data.simbot.meta.rawFormData.droptimizer.equipped)
    const itemsInBag = await parseBagGearsFromSimc(data.simbot.meta.rawFormData.text)

    return {
        ak: `${raidId},${raidDiff},${charInfo.name},${charInfo.server},${charInfo.spec},${charInfo.class}`,
        url: url,
        charInfo: charInfo,
        raidInfo: {
            id: raidId,
            difficulty: raidDiff // Difficulty is the third element
        },
        simInfo: {
            date: data.timestamp,
            fightstyle: data.sim.options.fight_style,
            duration: data.sim.options.max_time,
            nTargets: data.sim.options.desired_targets,
            upgradeEquipped: data.simbot.meta.rawFormData.droptimizer.upgradeEquipped,
            raidbotInput: data.simbot.meta.rawFormData.text
                ? data.simbot.meta.rawFormData.text
                : data.simbot.input
        },
        dateImported: getUnixTimestamp(),
        upgrades: await parseUpgrades(upgrades),
        currencies: data.simbot.meta.rawFormData.character.upgradeCurrencies ?? [],
        weeklyChest: await parseGreatVaultFromSimc(data.simbot.meta.rawFormData.text),
        itemsAverageItemLevel:
            data.simbot.meta.rawFormData.character.items.averageItemLevelEquipped ?? null,
        itemsAverageItemLevelEquipped:
            data.simbot.meta.rawFormData.character.items.averageItemLevelEquipped ?? null,
        itemsEquipped: itemsEquipped,
        itemsInBag: itemsInBag,
        tiersetInfo: await parseTiersets(itemsEquipped, itemsInBag)
    }
}

export const parseGreatVaultFromSimc = async (simc: string): Promise<GearItem[]> => {
    const rewardSectionRegex =
        /### Weekly Reward Choices\n([\s\S]*?)\n### End of Weekly Reward Choices/
    const match = simc.match(rewardSectionRegex)

    if (!match) return []

    const items: GearItem[] = []
    const itemsInDb: Item[] = await getItems()
    const itemRegex = /# .*?\((\d+)\)\n#.*?id=(\d+),bonus_id=([\d/]+)/g
    let itemMatch: string[] | null

    while ((itemMatch = itemRegex.exec(match[1])) !== null) {
        const bonusIds = itemMatch[3].split('/').map(Number)
        const itemId = parseInt(itemMatch[2], 10)

        // we dont have enough infos, we are forced to check on our db
        const wowItem = itemsInDb.find((i) => i.id === itemId)

        if (wowItem == null) {
            console.log(
                '[warn] parseGreatVaultFromSimc: Skipping weekly reward for item ' +
                    itemId +
                    ' - https://www.wowhead.com/item=' +
                    itemId +
                    '?bonus=' +
                    bonusIds.join(':')
            )
            continue
        }

        const itemTrack = parseItemTrack(bonusIds)
        if (itemTrack == null) {
            throw new Error(
                'parseGreatVaultFromSimc: Detected Vault item without item track... check import ' +
                    itemId +
                    ' - https://www.wowhead.com/item=' +
                    itemId +
                    '?bonus=' +
                    bonusIds.join(':')
            )
        }

        items.push({
            item: {
                id: itemId,
                name: wowItem.name,
                armorType: wowItem.armorType,
                slotKey: wowItem.slotKey,
                token: wowItem.token,
                tierset: wowItem.tierset,
                boe: wowItem.boe,
                veryRare: wowItem.veryRare,
                iconName: wowItem.iconName,
                season: wowItem.season
            },
            source: 'great-vault',
            itemLevel: parseInt(itemMatch[1], 10),
            bonusIds: bonusIds,
            enchantIds: null,
            gemIds: null,
            itemTrack: itemTrack
        })
    }

    return items
}

export async function parseBagGearsFromSimc(simc: string): Promise<GearItem[]> {
    // Extract "Gear from Bags" section
    const gearSectionMatch = simc.match(/Gear from Bags[\s\S]*?(?=\n\n|$)/)
    if (!gearSectionMatch) {
        console.log("Unable to find 'Gear from Bags' section.")
        return []
    }

    const gearSection = gearSectionMatch[0]
    const itemLines = gearSection.split('\n').filter((line) => line.includes('='))

    const itemsInDb: Item[] = await getItems()
    const items: GearItem[] = []

    for (const line of itemLines) {
        const slotMatch = line.match(/^# ([a-zA-Z_]+\d?)=/)
        const itemIdMatch = line.match(/,id=(\d+)/)
        const enchantIdMatch = line.match(/enchant_id=([\d/]+)/)
        const gemIdMatch = line.match(/gem_id=([\d/]+)/)
        const bonusIdMatch = line.match(/bonus_id=([\d/]+)/)
        const craftedStatsMatch = line.match(/crafted_stats=([\d/]+)/)
        const craftingQualityMatch = line.match(/crafting_quality=([\d/]+)/)

        if (slotMatch && itemIdMatch && bonusIdMatch) {
            const itemId = parseInt(itemIdMatch[1], 10)
            const bonusIds = bonusIdMatch[1].split('/').map(Number)
            const wowItem = itemsInDb.find((i) => i.id === itemId)

            if (wowItem == null) {
                console.log(
                    'parseBagGearsFromSimc: skipping bag item not in db: ' +
                        itemId +
                        ' https://www.wowhead.com/item=' +
                        itemId
                )
                continue
            }

            // skip importing pvp gear (for now)
            if (wowItem.name.startsWith('Algari Competitor')) {
                // Tww Season 1 PvP
                console.log(
                    'parseBagGearsFromSimc: skipping bag PvP item: ' +
                        itemId +
                        ' - https://www.wowhead.com/item=' +
                        itemId +
                        '?bonus=' +
                        bonusIds
                )
                continue
            }

            const itemTrack = parseItemTrack(bonusIds)

            let itemLevel: number | null = null
            if (itemTrack != null) {
                itemLevel = itemTrack.itemLevel
            } else {
                itemLevel = parseItemLevelFromBonusIds(wowItem, bonusIds)
            }

            if (itemLevel == null) {
                console.log(
                    'parseBagGearsFromSimc: skipping bag item without ilvl: ' +
                        itemId +
                        ' - https://www.wowhead.com/item=' +
                        itemId +
                        '?bonus=' +
                        bonusIds.join(':')
                )
                continue
            }

            const item: GearItem = {
                item: {
                    id: wowItem.id,
                    name: wowItem.name,
                    armorType: wowItem.armorType,
                    slotKey: wowItem.slotKey,
                    token: wowItem.token,
                    tierset: wowItem.tierset,
                    boe: wowItem.boe,
                    veryRare: wowItem.veryRare,
                    iconName: wowItem.iconName,
                    season: wowItem.season
                },
                source: 'bag',
                itemLevel: itemLevel,
                bonusIds: bonusIds,
                itemTrack: itemTrack,
                gemIds: gemIdMatch ? gemIdMatch[1].split('/').map(Number) : null,
                enchantIds: enchantIdMatch ? enchantIdMatch[1].split('/').map(Number) : null
            }
            if (craftedStatsMatch) item.craftedStats = craftedStatsMatch[1]
            if (craftingQualityMatch) item.craftingQuality = craftingQualityMatch[1]

            items.push(item)
        }
    }

    return items
}

export const parseEquippedGear = async (
    droptEquipped: z.infer<typeof droptimizerEquippedItemsSchema>
): Promise<GearItem[]> => {
    const itemsInDb: Item[] = await getItems()
    const res: GearItem[] = []

    for (const [slot, droptGearItem] of Object.entries(droptEquipped)) {
        if (!droptGearItem.bonus_id) {
            throw new Error(
                '[error] parseEquippedGear: found equipped item without bonus_id ' +
                    droptGearItem.id +
                    ' - https://www.wowhead.com/item=' +
                    droptGearItem.id
            )
        }
        const bonusIds = droptGearItem.bonus_id.split('/').map(Number)
        const wowItem = itemsInDb.find((i) => i.id === droptGearItem.id)
        if (wowItem == null) {
            throw new Error(
                '[error] parseEquippedGear: skipping equipped item not in db: ' +
                    droptGearItem.id +
                    ' - https://www.wowhead.com/item=' +
                    droptGearItem.id +
                    '?bonus=' +
                    bonusIds.join(':')
            )
        }

        let itemTrack: ItemTrack | null = null
        if (wowItem.sourceName !== 'Professions - Epic') {
            itemTrack = parseItemTrack(bonusIds)
            if (!itemTrack) {
                console.log(
                    '[warn] parseEquippedGear: found equipped item without item track ' +
                        droptGearItem.id +
                        ' - https://www.wowhead.com/item=' +
                        droptGearItem.id +
                        '?bonus=' +
                        bonusIds.join(':')
                )
            }
        }

        let realSlot = slot
        if (slot === 'mainHand') realSlot = 'main_hand'
        else if (slot === 'offHand') realSlot = 'off_hand'

        res.push({
            item: {
                id: wowItem.id,
                name: wowItem.name,
                armorType: wowItem.armorType,
                slotKey: wowItem.slotKey,
                token: wowItem.token,
                tierset: wowItem.tierset,
                boe: wowItem.boe,
                veryRare: wowItem.veryRare,
                iconName: wowItem.iconName,
                season: wowItem.season
            },
            source: 'equipped',
            equippedInSlot: wowItemEquippedSlotKeySchema.parse(realSlot),
            itemLevel: droptGearItem.itemLevel,
            bonusIds: droptGearItem.bonus_id ? bonusIds : null,
            enchantIds: null,
            gemIds: null,
            itemTrack: itemTrack
        })
    }
    return res
}
