import { CURRENT_SEASON, PROFESSION_TYPES } from '@shared/consts/wow.consts'
import { getUnixTimestamp, isInCurrentWowWeek } from '@shared/libs/date/date-utils'
import {
    applyAvoidance,
    applyDiffBonusId,
    applyLeech,
    applySocket,
    applySpeed,
    compareGearItem,
    gearAreTheSame,
    getItemTrack,
    parseItemLevelFromRaidDiff,
    parseItemTrack
} from '@shared/libs/items/item-bonus-utils'
import { equippedSlotToSlot } from '@shared/libs/items/item-slot-utils'
import { getItemBonusString, parseItemString } from '@shared/libs/items/item-string-parser'
import { getClassSpecsForRole } from '@shared/libs/spec-parser/spec-utils'
import { newLootSchema } from '@shared/schemas/loot.schema'
import {
    BisList,
    Character,
    CharacterWowAudit,
    CharAssignmentHighlights,
    CharAssignmentInfo,
    Droptimizer,
    DroptimizerCurrencies,
    DroptimizerUpgrade,
    GearItem,
    Item,
    ItemTrack,
    Loot,
    LootWithItem,
    NewLoot,
    NewLootManual,
    TierSetCompletion,
    WowItemSlotKey,
    WowRaidDifficulty,
    WowSpec
} from '@shared/types/types'
import { getItems } from '@storage/items/items.storage'
import { parse } from 'papaparse'
import { match } from 'ts-pattern'
import { z } from 'zod'
import {
    rawMrtRecordSchema,
    rawLootRecordSchema as rawRCLootRecordSchema
} from '../raid-session/raid-session.schemas'

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

export const parseMrtLoots = async (
    csv: string,
    dateLowerBound: number,
    dateUpperBound: number
): Promise<NewLoot[]> => {
    const lines = csv.split('\n').filter((line) => line.trim() !== '')
    const rawRecords = lines.map((line) => {
        const [
            timeRec,
            encounterID,
            instanceID,
            difficulty,
            playerName,
            classID,
            quantity,
            itemLink,
            rollType
        ] = line.split('#')
        return {
            timeRec: Number(timeRec),
            encounterID: Number(encounterID),
            instanceID: Number(instanceID),
            difficulty: Number(difficulty),
            playerName,
            classID: Number(classID),
            quantity: Number(quantity),
            itemLink,
            rollType: rollType ? Number(rollType) : null
        }
    })

    const validatedRecords = z
        .array(rawMrtRecordSchema)
        .parse(rawRecords)
        .filter((r) => r.rollType != null) // skip personal loot & currency

    const allItemsInDb = await getItems()
    const res: NewLoot[] = []

    const recordMap = new Map<string, number>()

    for (const record of validatedRecords) {
        try {
            const { timeRec, encounterID, difficulty, quantity, itemLink } = record

            const parsedItem = parseItemString(itemLink)
            if (timeRec < dateLowerBound || timeRec > dateUpperBound) {
                console.log(
                    'parseRcLoots: skipping loot item outside raid session date time ' + record
                )
                continue
            }
            if (quantity > 1) {
                console.log(
                    'parseMrtLoots: encounter loot with quantity =' + quantity + 'source: ' + record
                )
            }

            const itemId = parsedItem.itemID
            const bonusIds = getItemBonusString(parsedItem).split(':').map(Number)
            const wowItem = allItemsInDb.find((i) => i.id === itemId)

            const raidDiff = parseWowDiff(difficulty)

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

            if (wowItem.sourceType !== 'raid') {
                console.log(
                    'parseRcLoots: skipping non raid loot: ' +
                        itemId +
                        ' - https://www.wowhead.com/item=' +
                        itemId +
                        '?bonus=' +
                        bonusIds
                )
                continue
            }

            const itemTrack = parseItemTrack(bonusIds)
            let itemLevel: number = 0

            if (itemTrack != null) {
                itemLevel = itemTrack.itemLevel
            } else {
                // we are dealing with raid items only
                itemLevel = parseItemLevelFromRaidDiff(wowItem, raidDiff)
            }

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

            const key = `${timeRec}-${encounterID}-${difficulty}-${itemId}`
            const itemIndex = recordMap.get(key) || 0
            recordMap.set(key, itemIndex + 1)

            const id = `${key}-${itemIndex}`

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
                    iconName: wowItem.iconName,
                    season: wowItem.season
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
                dropDate: timeRec,
                itemString: itemLink,
                raidDifficulty: raidDiff,
                addonId: id
            }

            res.push(newLootSchema.parse(loot))
        } catch (error) {
            console.log('Error processing record:', record, error)
        }
    }

    return res
}

export const parseRcLoots = async (
    csv: string,
    dateLowerBound: number,
    dateUpperBound: number
): Promise<NewLoot[]> => {
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

    const rawRecords = z.array(rawRCLootRecordSchema).parse(filteredData)
    const allItemsInDb = await getItems()
    const res: NewLoot[] = []
    const recordMap = new Map<string, number>()

    for (const record of rawRecords) {
        try {
            const parsedItem = parseItemString(record.itemString)
            const { date, time, itemString, difficultyID, itemID: itemId, boss } = record

            const lootUnixTs = parseDateTime(date, time)
            if (lootUnixTs < dateLowerBound || lootUnixTs > dateUpperBound) {
                console.log(
                    'parseRcLoots: skipping loot item outside raid session date time ' + record
                )
                continue
            }

            const bonusIds = getItemBonusString(parsedItem).split(':').map(Number)
            const wowItem = allItemsInDb.find((i) => i.id === itemId)

            const raidDiff = parseWowDiff(difficultyID)

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
            if (wowItem.sourceType !== 'raid') {
                console.log(
                    'parseRcLoots: skipping non raid loot: ' +
                        itemId +
                        ' - https://www.wowhead.com/item=' +
                        itemId +
                        '?bonus=' +
                        bonusIds
                )
                continue
            }

            const itemTrack = parseItemTrack(bonusIds)
            let itemLevel: number = 0

            if (itemTrack != null) {
                itemLevel = itemTrack.itemLevel
            } else {
                // we are dealing with raid items only
                itemLevel = parseItemLevelFromRaidDiff(wowItem, raidDiff)
            }

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

            const key = `${lootUnixTs}-${boss}-${difficultyID}-${wowItem.id}`
            const itemIndex = recordMap.get(key) || 0
            recordMap.set(key, itemIndex + 1)

            const id = `${key}-${itemIndex}`

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
                    iconName: wowItem.iconName,
                    season: wowItem.season
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
                dropDate: lootUnixTs,
                itemString: itemString,
                raidDifficulty: raidDiff,
                addonId: id
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
                applyDiffBonusId(bonusIds, loot.raidDifficulty)
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
                    iconName: wowItem.iconName,
                    season: wowItem.season
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
                addonId: null,
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
    slotKey: WowItemSlotKey,
    charDroptimizers: Droptimizer[],
    charAssignedLoot: Loot[],
    charWowAudit: CharacterWowAudit | null
): GearItem[] => {
    if (slotKey === 'omni') return []

    const allItems: GearItem[] = [
        ...charDroptimizers.flatMap((d) => d.itemsEquipped),
        ...charDroptimizers.flatMap((d) => d.itemsInBag),
        ...charAssignedLoot.map((l) => l.gearItem)
    ]

    if (charWowAudit) {
        const wowAuditItem = charWowAudit.itemsEquipped.find((bg) => bg.item.slotKey === slotKey)
        if (wowAuditItem) {
            allItems.push(wowAuditItem)
        }
    }

    const filteredItems = allItems.filter((gear) => gear.item.slotKey === slotKey)
    const sortedItems = filteredItems.sort((a, b) => b.itemLevel - a.itemLevel)

    if (slotKey === 'finger' || slotKey === 'trinket') {
        const uniqueItems: GearItem[] = []
        const seenItemIds = new Set<number>()

        for (const item of sortedItems) {
            if (!seenItemIds.has(item.item.id)) {
                uniqueItems.push(item)
                seenItemIds.add(item.item.id)
            }
            if (uniqueItems.length === 2) break
        }
        return uniqueItems
    }

    return sortedItems.slice(0, 1)
}

export const parseLootBisSpecForChar = (
    bisList: BisList[],
    itemId: number,
    char: Character
): WowSpec[] => {
    const roleSpecIds = new Set(getClassSpecsForRole(char.class, char.role).map((s) => s.id))
    return bisList
        .filter((b) => b.itemId === itemId)
        .flatMap((b) => b.specIds)
        .filter((specId) => roleSpecIds.has(specId))
        .map((specId) => getClassSpecsForRole(char.class, char.role).find((s) => s.id === specId)!)
}

/**
 * Check if char already got the loot in bag/equipped/assigned
 * @param charDroptimizers
 * @param charAssignedLoots
 */
export const parseLootAlreadyGotIt = (
    loot: LootWithItem,
    charDroptimizers: Droptimizer[],
    charAssignedLoots: Loot[],
    charAuditData: CharacterWowAudit | null
): boolean => {
    if (loot.gearItem.item.slotKey === 'omni') return false

    const lastDroptWithTierInfo = charDroptimizers
        .filter((c) => c.itemsInBag.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)
        .at(0) // Can be undefined

    const availableGear: GearItem[] = [
        ...(lastDroptWithTierInfo?.itemsEquipped ?? []).filter((gi) => gi.item.id === loot.item.id),
        ...(lastDroptWithTierInfo?.itemsInBag ?? []).filter((gi) => gi.item.id === loot.item.id),
        ...charAssignedLoots.flatMap((l) =>
            l.gearItem.item.id === loot.item.id ? [l.gearItem] : []
        ),
        ...(charAuditData?.itemsEquipped ?? []).filter((gi) => gi.item.id === loot.item.id)
    ]

    return availableGear.some((gear) => gearAreTheSame(loot.gearItem, gear))
}

export const parseItemLevel = (
    charDroptimizers: Droptimizer[],
    charWowAudit: CharacterWowAudit | null
): string => {
    const lastDroptWithTierInfo = charDroptimizers
        .filter((c) => c.itemsEquipped.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)
        .at(0)

    const droptDate: number | null = lastDroptWithTierInfo?.simInfo.date ?? null
    const wowAuditDate: number | null = charWowAudit?.blizzardLastModifiedUnixTs ?? null

    const itemToCalc: GearItem[] | null = lastDroptWithTierInfo?.itemsEquipped ?? []

    if (!droptDate && wowAuditDate) {
        return charWowAudit?.averageIlvl ?? '?'
    } else if (droptDate && wowAuditDate && wowAuditDate > droptDate) {
        return charWowAudit?.averageIlvl ?? '?'
    }

    if (!itemToCalc || itemToCalc.length === 0) {
        return '?'
    }

    const sumIlvl = itemToCalc.reduce((sum, item) => sum + item.itemLevel, 0)
    const averageIlvl = sumIlvl / itemToCalc.length
    return averageIlvl.toFixed(2)
}

export const parseTiersetInfo = (
    charDroptimizers: Droptimizer[],
    charAssignedLoots: Loot[],
    charWowAudit: CharacterWowAudit | null
): GearItem[] => {
    const lastDroptWithTierInfo = charDroptimizers
        .filter((c) => c.tiersetInfo.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)
        .at(0)

    const tiersetsInfo: GearItem[] = []
    const tiersetsInBag: GearItem[] = []
    const tiersetAssigned: GearItem[] = charAssignedLoots
        .map((l) => l.gearItem)
        .filter((gi) => gi.item.season === CURRENT_SEASON && (gi.item.tierset || gi.item.token)) // tierset / token assigned in this session

    if (lastDroptWithTierInfo) {
        tiersetsInfo.push(
            ...lastDroptWithTierInfo.tiersetInfo.filter((gi) => gi.item.season === CURRENT_SEASON)
        )
        tiersetsInBag.push(
            // tierset / token in bag
            ...lastDroptWithTierInfo.itemsInBag.filter(
                (gi) => gi.item.season === CURRENT_SEASON && (gi.item.tierset || gi.item.token)
            )
        )
    }
    if (charWowAudit) {
        tiersetsInfo.push(
            ...charWowAudit.tiersetInfo.filter((gi) => gi.item.season === CURRENT_SEASON)
        )
    }

    const allItems: GearItem[] = [...tiersetsInfo, ...tiersetsInBag, ...tiersetAssigned]
    const maxItemLevelBySlot = new Map<WowItemSlotKey, GearItem>()

    allItems
        .filter((t) => t.item.slotKey !== 'omni') // omni will be counted later
        .forEach((gear) => {
            const existingGear = maxItemLevelBySlot.get(gear.item.slotKey)
            if (!existingGear || compareGearItem(gear, existingGear) > 0) {
                maxItemLevelBySlot.set(gear.item.slotKey, gear)
            }
        })

    return [
        ...Array.from(maxItemLevelBySlot.values()), // tierset found
        ...allItems.filter((t) => t.item.slotKey === 'omni') // omni tokens
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
 * Parses the Great Vault loot from the provided Droptimizers array.
 *
 * This function filters the Droptimizers to include only those with a non-empty weekly chest
 * and whose simulation information date is within the current World of Warcraft week.
 * It then sorts the filtered Droptimizers by their simulation information date in descending order
 * and returns the weekly chest of the most recent Droptimizer.
 *
 * @param {Droptimizer[]} droptimizers - An array of Droptimizer objects to parse.
 * @returns {GearItem[]} An array of GearItem objects representing the loot from the Great Vault.
 */
export const parseGreatVault = (droptimizers: Droptimizer[]): GearItem[] =>
    droptimizers
        .filter((c) => c.weeklyChest.length > 0 && isInCurrentWowWeek(c.simInfo.date)) // keep vault of this wow reset
        .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]?.weeklyChest ?? []

export const parseCurrencies = (droptimizers: Droptimizer[]): DroptimizerCurrencies[] =>
    droptimizers
        .filter((c) => c.currencies.length > 0)
        .sort((a, b) => b.simInfo.date - a.simInfo.date)[0]?.currencies ?? []

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
    charInfo: Omit<CharAssignmentInfo, 'highlights'>,
    maxDpsGain: number
): CharAssignmentHighlights => {
    const { bestItemsInSlot, bisForSpec, character, droptimizers, tierset, alreadyGotIt } = charInfo

    const isMain = character.main

    // take max upgrade from available dropt
    const maxUpgrade = droptimizers
        .map((d) => d.upgrade?.dps ?? 0)
        .reduce((max, upgrade) => (upgrade > max ? upgrade : max), 0)

    const tierSetCompletion = calculateTiersetCompletion(loot, tierset)

    let bestItemInSlot: GearItem | undefined
    if (loot.gearItem.item.slotKey === 'omni') {
        // loot is omni token: we compare with lowest track tierset available
        bestItemInSlot = tierset.sort((a, b) => compareGearItem(a, b)).at(0)
    } else if (bestItemsInSlot.length === 2) {
        // slot has 2 possible gear item (eg: finger,trinket), we take the lowest track
        bestItemInSlot = bestItemsInSlot.sort((a, b) => compareGearItem(a, b)).at(0)
    } else {
        bestItemInSlot = bestItemsInSlot.at(0)
    }

    const ilvlDiff = bestItemInSlot ? loot.gearItem.itemLevel - bestItemInSlot.itemLevel : -999

    let isTrackUpgrade = false
    if (bestItemInSlot != null) {
        isTrackUpgrade = compareGearItem(loot.gearItem, bestItemInSlot) > 0 ? true : false
    }

    const res: Omit<CharAssignmentHighlights, 'score'> = {
        isMain,
        dpsGain: maxUpgrade,
        tierSetCompletion,
        gearIsBis: bisForSpec.length > 0,
        ilvlDiff,
        isTrackUpgrade,
        alreadyGotIt
    }

    return { ...res, score: evalScore(res, maxDpsGain) }
}

export const evalScore = (
    highlights: Omit<CharAssignmentHighlights, 'score'>,
    maxDdpsGain: number
): number => {
    const {
        dpsGain,
        ilvlDiff,
        gearIsBis,
        isMain,
        tierSetCompletion,
        isTrackUpgrade,
        alreadyGotIt
    } = highlights

    //if(!isMain) return 0 // TODO: uncomment this when testing is finished

    if (isMain) Promise.resolve()

    if (alreadyGotIt) return 0

    const normalizedDps = dpsGain / maxDdpsGain
    const baseScore = gearIsBis ? 1 + normalizedDps : normalizedDps

    // Lowest non 0 score possible, just to order this character
    // above characters with no gain whatsoever
    if (baseScore === 0 && ilvlDiff > 0) return 1

    const tierSetMultiplier = match(tierSetCompletion)
        .with({ type: '4p' }, () => 1.3)
        .with({ type: '2p' }, () => 1.2)
        .with({ type: 'none' }, () => 1)
        .exhaustive()

    const trackMultiplier = isTrackUpgrade ? 1.1 : 1
    const ilvlDiffMultiplier = ilvlDiff > 0 ? 1 + 0.05 * ilvlDiff : 1

    const score = baseScore * tierSetMultiplier * trackMultiplier * ilvlDiffMultiplier

    const formattedScore = Math.round(score * 100)

    return formattedScore
}
