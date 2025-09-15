import { CURRENT_SEASON } from '@shared/consts/wow.consts'
import { getUnixTimestamp } from '@shared/libs/date/date-utils'
import {
    applyItemTrackByIlvlAndDiff,
    evalRealSeason,
    gearAreTheSame,
    parseItemTrack
} from '@shared/libs/items/item-bonus-utils'
import { equippedSlotToSlot } from '@shared/libs/items/item-slot-utils'
import { raidbotsURLSchema } from '@shared/schemas/simulations.schemas'
import { wowItemEquippedSlotKeySchema, wowRaidDiffSchema } from '@shared/schemas/wow.schemas'
import type {
    GearItem,
    Item,
    ItemTrack,
    NewDroptimizer,
    NewDroptimizerUpgrade,
    RaidbotsURL,
    WowClassName,
    WowItemEquippedSlotKey,
    WowRaidDifficulty
} from '@shared/types/types'
import {
    getItems,
    getItemToCatalystMapping,
    getItemToTiersetMapping,
    getTiersetAndTokenList
} from '@storage/items/items.storage'
import { z } from 'zod'
import {
    droptimizerEquippedItemsSchema,
    RaidbotJson,
    raidbotJsonSchema
} from './droptimizer.schemas'
import { parseBagGearsFromSimc, parseCatalystFromSimc, parseGreatVaultFromSimc } from './simc.utils'

export const fetchDroptimizerFromURL = async (url: string): Promise<NewDroptimizer> => {
    const raidbotsURL = raidbotsURLSchema.parse(url)
    const jsonData = await fetchRaidbotsData(raidbotsURL)
    const parsedJson = parseRaidbotsData(jsonData)

    const droptimizer = await convertJsonToDroptimizer(url, parsedJson)

    return droptimizer
}

export const fetchRaidbotsData = async (url: RaidbotsURL): Promise<unknown> => {
    const responseJson = await fetch(`${url}/data.json`)
    if (!responseJson.ok) {
        throw new Error(
            `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        )
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
    raidDiff: WowRaidDifficulty,
    upgrades: {
        dps: number
        encounterId: number
        itemId: number
        ilvl: number
        slot: WowItemEquippedSlotKey
    }[],
    itemsInBag: GearItem[],
    itemsEquipped: GearItem[]
): Promise<NewDroptimizerUpgrade[]> => {
    const itemToTiersetMapping = await getItemToTiersetMapping()
    const itemToCatalystMapping = await getItemToCatalystMapping()

    // One Armed Bandit workaround for Best-In-Slots item
    const bestInSlotUpgrades = upgrades.find(up => up.itemId === 232526 || up.itemId === 232805)
    if (bestInSlotUpgrades != null) {
        console.log('parseUpgrades: applying workaround for Best-in-Slots item id 232526 or 232805')
        const otherId = bestInSlotUpgrades.itemId === 232526 ? 232805 : 232526
        const newUprade = { ...bestInSlotUpgrades, itemId: otherId }
        upgrades.push(newUprade)
    }

    const charItems = [...itemsInBag, ...itemsEquipped]

    const upgradesMap = upgrades
        // filter out item without dps gain
        .filter(item => item.dps > 0)
        // filter out item already in bags or equipped
        .filter(item => {
            const bonusIds: number[] = []
            const itemTrack = applyItemTrackByIlvlAndDiff(bonusIds, item.ilvl, raidDiff)
            const upgradeGear: GearItem = {
                item: {
                    id: item.itemId,
                    slotKey: equippedSlotToSlot(item.slot),
                    season: CURRENT_SEASON,
                    name: '', // not needed for comparison
                    armorType: null, // not needed for comparison
                    token: false, // not needed for comparison
                    tierset: false, // not needed for comparison
                    boe: false, // not needed for comparison,
                    veryRare: false, // not needed for comparison
                    iconName: '', // not needed for comparison
                    specIds: null // not needed for comparison
                },
                source: 'bag',
                itemLevel: item.ilvl,
                bonusIds: bonusIds,
                itemTrack: itemTrack,
                gemIds: null,
                enchantIds: null
            }
            return charItems.every(bagGear => !gearAreTheSame(bagGear, upgradeGear))
        })
        // remap itemid to tierset & catalyst
        .map(up => {
            // ci serve questo mapping perchè in data.csv è presente l'upgrade per l'itemid del pezzo del tierset finale (es: guanti warlock)
            // ma questo itemid non appartiene alla loot table del boss, che può lootare solo token per gruppi di classi
            const tiersetMapping = itemToTiersetMapping?.find(i => i.itemId === up.itemId)

            // ci serve questo reverse lookup perchè in data.csv di droptimizer per un upgrade di tipo catalizzato è presente:
            // 1. l'item id finale dopo la trasformazione catalyst (che non appartiene alla loot table del boss)
            // 2. il boss encounter id dove esce l'item da catalizzare
            // tramite la tabella di mapping ItemToCatalyst riusciamo a ricavare l'item id "originale" della loot table del boss
            const catalystMapping = !tiersetMapping
                ? itemToCatalystMapping?.find(
                      i => i.catalyzedItemId === up.itemId && i.encounterId === up.encounterId
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
    const tiersetItems = await getTiersetAndTokenList()

    const tiersetItemIds = new Set(tiersetItems.map(item => item.id))

    const allItems = [...equipped, ...bags]

    return allItems.filter(item => tiersetItemIds.has(item.item.id))
}

export const convertJsonToDroptimizer = async (
    url: string,
    data: RaidbotJson
): Promise<NewDroptimizer> => {
    // transform
    const raidId = Number(data.sim.profilesets.results[0].name.split('/')[0])
    const raidDiff: WowRaidDifficulty = wowRaidDiffSchema.parse(
        data.simbot.publicTitle.split('•')[2].replaceAll(' ', '')
    )

    const dpsMean =
        data.sim.players[0].specialization.toLowerCase() !== 'augmentation evoker'
            ? data.sim.players[0].collected_data.dps.mean
            : data.sim.statistics.raid_dps.mean // augmentation evoker dps mean is the whole raid dps, not just the player

    const upgrades = data.sim.profilesets.results.map(item => ({
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

    if (itemsInBag.length === 0) {
        throw new Error('No items found in bags: ' + url)
    }

    // Merge currencies from rawFormData and parseCatalystFromSimc
    const upgradeCurrencies = data.simbot.meta.rawFormData.character.upgradeCurrencies ?? []
    const catalystCurrencies = await parseCatalystFromSimc(data.simbot.meta.rawFormData.text)
    const mergedCurrencies = [...upgradeCurrencies, ...catalystCurrencies]

    return {
        ak: `${raidId},${raidDiff},${charInfo.name},${charInfo.server},${charInfo.spec},${charInfo.class}`,
        url,
        charInfo,
        raidInfo: {
            id: raidId,
            difficulty: raidDiff
        },
        simInfo: {
            date: data.timestamp,
            fightstyle: data.sim.options.fight_style,
            duration: data.sim.options.max_time,
            nTargets: data.sim.options.desired_targets,
            upgradeEquipped: data.simbot.meta.rawFormData.droptimizer.upgradeEquipped
        },
        dateImported: getUnixTimestamp(),
        upgrades: await parseUpgrades(raidDiff, upgrades, itemsInBag, itemsEquipped),
        currencies: mergedCurrencies,
        weeklyChest: await parseGreatVaultFromSimc(data.simbot.meta.rawFormData.text),
        itemsAverageItemLevel:
            data.simbot.meta.rawFormData.character.items.averageItemLevelEquipped ?? null,
        itemsAverageItemLevelEquipped:
            data.simbot.meta.rawFormData.character.items.averageItemLevelEquipped ?? null,
        itemsEquipped,
        itemsInBag,
        tiersetInfo: await parseTiersets(itemsEquipped, itemsInBag)
    }
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
        const wowItem = itemsInDb.find(i => i.id === droptGearItem.id)
        if (wowItem == null) {
            console.log(
                '[error] parseEquippedGear: skipping equipped item not in db: ' +
                    droptGearItem.id +
                    ' - https://www.wowhead.com/item=' +
                    droptGearItem.id +
                    '?bonus=' +
                    bonusIds.join(':')
            )
            continue
            // throw new Error(
            //     '[error] parseEquippedGear: skipping equipped item not in db: ' +
            //         droptGearItem.id +
            //         ' - https://www.wowhead.com/item=' +
            //         droptGearItem.id +
            //         '?bonus=' +
            //         bonusIds.join(':')
            // )
        }

        let itemTrack: ItemTrack | null = null
        if (
            wowItem.sourceType !== 'profession593' && // crafted items doesn not have item track
            !wowItem.sourceType.startsWith('special') // special season items like circe's circlet and s2 belt does not have item track
        ) {
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
                season: evalRealSeason(wowItem, droptGearItem.itemLevel),
                specIds: wowItem.specIds
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
