import { PROFESSION_TYPES } from '@shared/consts/wow.consts'
import {
    applyAvoidance,
    applyLeech,
    applySocket,
    applySpeed,
    applyTokenDiff,
    getItemTrack,
    parseItemLevelFromTrack,
    parseItemTrack
} from '@shared/libs/items/item-bonus-utils'
import { equippedSlotToSlot } from '@shared/libs/items/item-slot-utils'
import { getItemBonusString, parseItemString } from '@shared/libs/items/item-string-parser'
import { getClassSpecs } from '@shared/libs/spec-parser/spec-parser'
import { newLootSchema } from '@shared/schemas/loot.schema'
import {
    BisList,
    CharAssignmentHighlights,
    CharAssignmentInfo,
    Droptimizer,
    DroptimizerUpgrade,
    GearItem,
    Item,
    ItemTrack,
    LootWithItem,
    NewLoot,
    NewLootManual,
    TierSetCompletion,
    WowClassName,
    WowItemSlotKey,
    WowRaidDifficulty
} from '@shared/types/types'
import { getItems } from '@storage/items/items.storage'
import { getUnixTimestamp } from '@utils'
import { parse } from 'papaparse'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { rawLootRecordSchema } from '../raid-session/raid-session.schemas'

const parseWowDiff = (wowDiff: number): WowRaidDifficulty => {
    switch (wowDiff) {
        case 14:
            return 'Normal'
        case 15:
            return 'Heroic'
        case 16:
            return 'Mythic'
        default:
            return 'Mythic'
    }
}

export const parseRcLoots = async (csv: string): Promise<NewLoot[]> => {
    const parsedData = parse(csv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    })

    if (!parsedData.data || parsedData.errors.length > 0) {
        console.log(parsedData.errors)
        throw new Error('Error during parsing RCLoot CSV:' + parsedData.errors[0])
    }

    const filteredData = parsedData.data.filter(
        (record) =>
            !PROFESSION_TYPES.has(record.subType) &&
            !record.response.toLowerCase().includes('personal loot')
    )

    const rawRecords = z.array(rawLootRecordSchema).parse(filteredData)
    const allItemsInDb = await getItems()
    const res: NewLoot[] = []

    for (const record of rawRecords) {
        try {
            const parsedItem = parseItemString(record.itemString)
            const { date, time, itemString, difficultyID, itemID: itemId, id } = record

            const bonusIds = getItemBonusString(parsedItem).split(':').map(Number)
            const wowItem = allItemsInDb.find((i) => i.id === itemId)

            if (!wowItem) {
                console.log(
                    'parseRcLoots: skipping loot item not in db: ' +
                        itemId +
                        ' https://www.wowhead.com/item=' +
                        itemId +
                        '?bonus=' +
                        bonusIds
                )
                continue
            }

            const itemTrack = parseItemTrack(bonusIds)
            const itemLevel = parseItemLevelFromTrack(wowItem, itemTrack, bonusIds)

            if (itemLevel == null) {
                console.log(
                    'parseRcLoots: skipping loot item without ilvl: ' +
                        itemId +
                        ' - https://www.wowhead.com/item=' +
                        itemId +
                        '?bonus=' +
                        bonusIds
                )
                continue
            }

            const gearItem: GearItem = {
                item: {
                    id: wowItem.id,
                    name: wowItem.name,
                    armorType: wowItem.armorType,
                    slotKey: wowItem.slotKey,
                    token: wowItem.token,
                    tierset: wowItem.tierset,
                    boe: wowItem.boe,
                    veryRare: wowItem.veryRare,
                    iconName: wowItem.iconName
                },
                source: 'loot',
                itemLevel: itemLevel,
                bonusIds: bonusIds,
                itemTrack: itemTrack,
                gemIds: null,
                enchantIds: null
            }

            const loot: NewLoot = {
                gearItem: gearItem,
                dropDate: parseDateTime(date, time),
                itemString: itemString,
                raidDifficulty: parseWowDiff(difficultyID),
                rclootId: id
            }

            res.push(newLootSchema.parse(loot))
        } catch (error) {
            console.log('Error processing record:', record, error)
        }
    }

    return res
}

export const parseManualLoots = async (loots: NewLootManual[]): Promise<NewLoot[]> => {
    const allItemsInDb = await getItems()
    const res: NewLoot[] = []

    for (const loot of loots) {
        try {
            const wowItem = allItemsInDb.find((i) => i.id === loot.itemId)

            if (!wowItem) {
                console.log(
                    'parseManualLoots: skipping loot item not in db: ' +
                        loot.itemId +
                        ' https://www.wowhead.com/item=' +
                        loot.itemId
                )
                continue
            }

            let itemLevel
            switch (loot.raidDifficulty) {
                case 'Heroic':
                    itemLevel = wowItem.ilvlHeroic
                    break
                case 'Mythic':
                    itemLevel = wowItem.ilvlMythic
                    break
                case 'Normal':
                    itemLevel = wowItem.ilvlNormal
                    break
                default:
                    itemLevel = wowItem.ilvlBase
                    break
            }

            const bonusIds: number[] = []

            if (loot.hasSocket) applySocket(bonusIds)
            if (loot.hasAvoidance) applyAvoidance(bonusIds)
            if (loot.hasLeech) applyLeech(bonusIds)
            if (loot.hasSpeed) applySpeed(bonusIds)

            let itemTrack: ItemTrack | null = null
            if (wowItem.token) {
                // apply bonus id to token (Mythic/Heroic tag)
                applyTokenDiff(bonusIds, loot.raidDifficulty)
            } else {
                itemTrack = getItemTrack(itemLevel, loot.raidDifficulty)
            }

            if (itemLevel == null) {
                console.log(
                    'parseManualLoots: skipping loot item without ilvl: ' +
                        loot.itemId +
                        ' - https://www.wowhead.com/item=' +
                        loot.itemId
                )
                continue
            }

            const gearItem: GearItem = {
                item: {
                    id: wowItem.id,
                    name: wowItem.name,
                    armorType: wowItem.armorType,
                    slotKey: wowItem.slotKey,
                    token: wowItem.token,
                    tierset: wowItem.tierset,
                    boe: wowItem.boe,
                    veryRare: wowItem.veryRare,
                    iconName: wowItem.iconName
                },
                source: 'loot',
                itemLevel: itemLevel,
                bonusIds: bonusIds,
                itemTrack: itemTrack,
                gemIds: null,
                enchantIds: null
            }

            const nl: NewLoot = {
                ...loot,
                gearItem: gearItem,
                rclootId: null,
                itemString: null,
                dropDate: getUnixTimestamp() // now
            }

            res.push(newLootSchema.parse(nl))
        } catch (error) {
            console.log('Error processing record:', loot, error)
        }
    }

    return res
}

const parseDateTime = (dateStr: string, timeStr: string): number => {
    // Split date components
    const [day, month, shortYear] = dateStr.split('/')

    // Convert 2-digit year to 4-digit (assuming 20xx for years 00-99)
    const fullYear = `20${shortYear}`

    // Create ISO format date string (yyyy-mm-ddTHH:mm:ss)
    const isoDateTime = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr}`

    const dateTime = new Date(isoDateTime)

    if (isNaN(dateTime.getTime())) {
        throw new Error(`Unable to parse date/time: ${dateStr} ${timeStr}`)
    }

    return dateTime.getTime() / 1000
}

export const parseBestItemInSlot = (
    slot: WowItemSlotKey,
    droptimizers: Droptimizer[]
): GearItem[] => {
    if (slot == 'omni') return []

    const allItemsEquipped: GearItem[] = droptimizers.flatMap((d) => d.itemsEquipped)
    const allItemsInBag: GearItem[] = droptimizers.flatMap((d) => d.itemsInBag)
    const allItems = [...allItemsEquipped, ...allItemsInBag]

    const filteredItems = allItems.filter((gear) => gear.item.slotKey === slot)
    const sortedItems = filteredItems.sort((a, b) => b.itemLevel - a.itemLevel)

    if (slot === 'finger' || slot === 'trinket') {
        return sortedItems.slice(0, 2)
    }

    return sortedItems.slice(0, 1)
}

export const parseLootBisForClass = (
    bisList: BisList[],
    lootId: number,
    wowClass: WowClassName
): BisList[] => {
    const classSpecs = getClassSpecs(wowClass).map((s) => s.id)
    return bisList.filter(
        (b) => b.itemId === lootId && b.specIds.some((specId) => classSpecs.includes(specId))
    )
}

/**
 * Todo: include assigned loot in the calculation
 * @param tiersetInfo
 * @returns
 */
export const parseTiersetInfo = (charDroptimizers: Droptimizer[]): GearItem[] => {
    const droptWithTierInfo = charDroptimizers
        .filter((c) => c.tiersetInfo.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]

    if (droptWithTierInfo == null) return []

    const maxItemLevelBySlot = new Map<string, GearItem>()

    droptWithTierInfo.tiersetInfo
        .filter((t) => t.item.slotKey !== 'omni') // omni will be counted later
        .forEach((gear) => {
            if (gear.itemTrack) {
                const existingItem = maxItemLevelBySlot.get(gear.item.slotKey)
                // todo: should consider also item with bigger track
                // es: 626HC vs 626M
                if (!existingItem || gear.itemLevel > existingItem.itemLevel) {
                    maxItemLevelBySlot.set(gear.item.slotKey, gear)
                }
            } else {
                throw new Error('Found tierset without track infos: ' + gear)
            }
        })

    return [
        ...Array.from(maxItemLevelBySlot.values()), // tierset found
        ...droptWithTierInfo.tiersetInfo.filter((t) => t.item.slotKey === 'omni') // omni tokens
    ]
}

export const parseDroptimizersInfo = (
    lootItem: Item,
    raidDiff: WowRaidDifficulty,
    droptimizers: Droptimizer[]
): {
    upgrade: DroptimizerUpgrade | null
    itemEquipped: GearItem
    droptimizer: Droptimizer
}[] => {
    // filter the correct droptimizer difficulty
    const filteredDropt = droptimizers.filter((d) => d.raidInfo.difficulty === raidDiff)

    // omni token edge scenario
    // we take every tierset in upgrades and take the one with max gain
    if (lootItem.slotKey === 'omni') {
        // find the the tierset with the max gain
        return filteredDropt
            .map((droptimizer) => {
                const upgrades = droptimizer.upgrades
                    .filter((up) => up.tiersetItemId)
                    .sort((a, b) => b.dps - a.dps)
                if (upgrades.length > 0) {
                    const itemEquipped = droptimizer.itemsEquipped.find(
                        (gearItem) => gearItem.equippedInSlot === upgrades[0].slot
                    )!
                    return { upgrade: upgrades[0], itemEquipped, droptimizer }
                } else {
                    return { upgrade: null, itemEquipped: null, droptimizer }
                }
            })
            .filter((dropt) => dropt.itemEquipped != null)
            .sort((a, b) => (b.upgrade?.dps || 0) - (a.upgrade?.dps || 0)) // sort droptimizers info by dps gain desc
    }

    return filteredDropt
        .map((droptimizer) => {
            const upgrade = droptimizer.upgrades.find(({ item }) => item.id === lootItem.id) || null

            // logic here:
            // if an upgrade exists in that droptimizer -> take slot information from droptimizer
            // else we take the first item equipped in that slot (it does matter in finger1/2 and trinket1/2 scenario)
            const itemEquipped = upgrade
                ? droptimizer.itemsEquipped.find(
                      (gearItem) => gearItem.equippedInSlot === upgrade.slot
                  )!
                : droptimizer.itemsEquipped.find(
                      (gearItem) =>
                          equippedSlotToSlot(gearItem.equippedInSlot!) === lootItem.slotKey
                  )!

            return { upgrade, itemEquipped, droptimizer }
        })
        .sort((a, b) => (b.upgrade?.dps || 0) - (a.upgrade?.dps || 0)) // sort droptimizers info by dps gain desc
}

/**
 * // more recent droptimizer with weekly chest info
 * // todo: exclude if not in the current wow reset?
 * @param droptimizers
 * @returns
 */
export const parseWeeklyChest = (droptimizers: Droptimizer[]): GearItem[] =>
    droptimizers
        .filter((c) => c.weeklyChest.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]?.weeklyChest ?? []

const calculateTiersetCompletion = (
    loot: LootWithItem,
    currentTierset: GearItem[]
): TierSetCompletion => {
    if (!loot.item.token) return { type: 'none' }

    const isValidSlot =
        loot.item.slotKey === 'omni' ||
        !currentTierset.some((t) => t.item.slotKey === loot.item.slotKey)

    if (!isValidSlot) return { type: 'none' }

    return match<number, TierSetCompletion>(currentTierset.length)
        .with(1, () => ({ type: '2p' }))
        .with(3, () => ({ type: '4p' }))
        .otherwise(() => ({ type: 'none' }))
}

export const evalHighlightsAndScore = (
    loot: LootWithItem,
    input: Omit<CharAssignmentInfo, 'highlights'>
): CharAssignmentHighlights => {
    const isMain = input.character.main

    // take max upgrade from available dropt
    const maxUpgrade = input.droptimizers
        .map((d) => d.upgrade?.dps ?? 0)
        .reduce((max, upgrade) => (upgrade > max ? upgrade : max), 0)

    const tierSetCompletion = calculateTiersetCompletion(loot, input.tierset)

    // todo: check only for spec associated with role (es: shaman healer = [restoration])
    const isBis = input.bis.find((bis) => bis.itemId === loot.item.id) != null

    const bestItemInSlotItemLevel =
        input.bestItemInSlot.sort((a, b) => b.itemLevel - a.itemLevel)[0]?.itemLevel ?? -1

    let ilvlDiff = -1
    if (loot.gearItem.itemLevel > 0 && bestItemInSlotItemLevel > 0) {
        ilvlDiff = loot.gearItem.itemLevel - bestItemInSlotItemLevel
    }

    const res: Omit<CharAssignmentHighlights, 'score'> = {
        isMain: isMain,
        dpsGain: maxUpgrade,
        tierSetCompletion,
        gearIsBis: isBis,
        gearIlvlUpgrade: ilvlDiff
    }

    return { ...res, score: evalScore(res) }
}

export const evalScore = (highlights: Omit<CharAssignmentHighlights, 'score'>): number => {
    const { dpsGain, gearIlvlUpgrade, gearIsBis, isMain, tierSetCompletion } = highlights

    if (!isMain) return 0 // TODO: comment if testing is needed

    const tierSetBonus = match(tierSetCompletion)
        .with({ type: '4p' }, () => 30000)
        .with({ type: '2p' }, () => 20000)
        .with({ type: 'none' }, () => 0)
        .exhaustive()

    const bisBonus = gearIsBis ? 20000 : 0

    const ilvlDiffBonus = gearIlvlUpgrade > 0 ? 1000 * gearIlvlUpgrade : 0 // TODO: is this needed?

    return dpsGain + tierSetBonus + bisBonus + ilvlDiffBonus
}
