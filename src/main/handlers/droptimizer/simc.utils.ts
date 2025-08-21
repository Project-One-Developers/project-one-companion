import { CURRENT_CATALYST_CHARGE_ID } from '@shared/consts/wow.consts'
import {
    evalRealSeason,
    parseItemLevelFromBonusIds,
    parseItemTrack
} from '@shared/libs/items/item-bonus-utils'
import { wowItemEquippedSlotKeySchema } from '@shared/schemas/wow.schemas'
import type { DroptimizerCurrency, GearItem, Item, SimC } from '@shared/types/types'
import { getItems, getTiersetAndTokenList } from '@storage/items/items.storage'

export const parseSimC = async (simc: string): Promise<SimC> => {
    const itemsInBag = await parseBagGearsFromSimc(simc)
    const itemsEquipped = await parseEquippedGearFromSimc(simc)
    const weeklyChest = await parseGreatVaultFromSimc(simc)

    const { charName, dateGenerated, charRealm, hash } = parseCharacterInfo(simc)

    // Merge currencies from rawFormData and parseCatalystFromSimc
    const upgradeCurrencies = await parseCurrenciesFromSimc(simc)
    const catalystCurrencies = await parseCatalystFromSimc(simc)
    const mergedCurrencies = [...upgradeCurrencies, ...catalystCurrencies]

    return {
        hash: hash,
        dateGenerated: dateGenerated,
        charName: charName,
        charRealm: charRealm,
        itemsInBag: itemsInBag,
        itemsEquipped: itemsEquipped,
        weeklyChest: weeklyChest,
        currencies: mergedCurrencies,
        tiersetInfo: await parseTiersets(itemsEquipped, itemsInBag)
    }
}

const parseCharacterInfo = (
    simc: string
): { charName: string; dateGenerated: number; charRealm: string; hash: string } => {
    const lines = simc.split('\n')
    const firstLine = lines[0]

    // Parse first line: # Soulpala - Holy - 2025-08-18 10:05 - EU/Pozzo dell'Eternità
    const firstLineRegex = /^# (.+?) - .+? - (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) - .+$/
    const firstLineMatch = firstLine.match(firstLineRegex)

    if (!firstLineMatch) {
        throw new Error('Unable to parse character name and date from first line')
    }

    const charName = firstLineMatch[1]
    const dateString = firstLineMatch[2]
    const dateGenerated = parseSimcDateToUnixTimestamp(dateString)

    // Parse realm from server line: server=pozzo_delleternità
    const serverRegex = /^server=(.+)$/m
    const serverMatch = simc.match(serverRegex)

    if (!serverMatch) {
        throw new Error('Unable to parse server/realm from SimC data')
    }

    const charRealm = serverMatch[1].replace('_', '-')

    // Parse checksum: # Checksum: 77a3aabe
    const checksumRegex = /^# Checksum: (.+)$/m
    const checksumMatch = simc.match(checksumRegex)

    if (!checksumMatch) {
        throw new Error('Unable to parse checksum from SimC data')
    }

    const hash = checksumMatch[1]

    return {
        charName,
        dateGenerated,
        charRealm,
        hash
    }
}

/**
 * Parses a date string in multiple formats to a Unix timestamp.
 * Supported formats:
 * - "YYYY-MM-DD HH:MM" (e.g., "2025-08-18 10:05")
 *
 * @param dateString - The date string to parse.
 * @returns The Unix timestamp corresponding to the given date string.
 */
export const parseSimcDateToUnixTimestamp = (dateString: string): number => {
    const [datePart, timePart] = dateString.split(' ')

    // Handle YYYY-MM-DD format
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    const date = new Date(year, month - 1, day, hours, minutes)

    // Validate the parsed date
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`)
    }

    return Math.floor(date.getTime() / 1000)
}

export const parseCatalystFromSimc = async (simc: string): Promise<DroptimizerCurrency[]> => {
    const catalystRegex = /# catalyst_currencies=([^\n]+)/
    const match = simc.match(catalystRegex)

    if (!match) {
        return []
    }

    const catalystData = match[1]
    const currencies: DroptimizerCurrency[] = []

    // Split by '/' to get individual currency entries
    const currencyEntries = catalystData.split('/')

    for (const entry of currencyEntries) {
        // Split by ':' to get id and amount
        const [idStr, amountStr] = entry.split(':')

        if (idStr && amountStr) {
            const id = parseInt(idStr, 10)
            const amount = parseInt(amountStr, 10)

            if (!isNaN(id) && !isNaN(amount) && CURRENT_CATALYST_CHARGE_ID === id && amount > 0) {
                // track only catalyst from active season
                currencies.push({
                    type: 'currency', // used to compose wowhead href
                    id: id,
                    amount: amount
                })
            }
        }
    }

    return currencies
}

export const parseCurrenciesFromSimc = async (simc: string): Promise<DroptimizerCurrency[]> => {
    const currenciesRegex = /# upgrade_currencies=([^\n]+)/
    const match = simc.match(currenciesRegex)

    if (!match) {
        return []
    }

    const catalystData = match[1]
    const currencies: DroptimizerCurrency[] = []

    // Split by '/' to get individual currency entries
    const currencyEntries = catalystData.split('/')

    for (const entry of currencyEntries) {
        // Split by ':' to get id and amount
        const [type, idStr, amountStr] = entry.split(':')

        if (type && idStr && amountStr) {
            const id = parseInt(idStr, 10)
            const amount = parseInt(amountStr, 10)

            if (!isNaN(id) && !isNaN(amount)) {
                // track only catalyst from active season
                currencies.push({
                    type: type === 'c' ? 'currency' : 'item', // used to compose wowhead href
                    id: id,
                    amount: amount
                })
            }
        }
    }

    return currencies
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
        const wowItem = itemsInDb.find(i => i.id === itemId)

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
                `parseGreatVaultFromSimc: Detected Vault item without item track... check import ${itemId} - https://www.wowhead.com/item=${itemId}?bonus=${bonusIds.join(':')}`
            )
        }

        const itemLevel = parseInt(itemMatch[1], 10)

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
                season: evalRealSeason(wowItem, itemLevel),
                specIds: wowItem.specIds
            },
            source: 'great-vault',
            itemLevel: itemLevel,
            bonusIds: bonusIds,
            enchantIds: null,
            gemIds: null,
            itemTrack: itemTrack
        })
    }

    return items
}

const parseTiersets = async (equipped: GearItem[], bags: GearItem[]): Promise<GearItem[]> => {
    const tiersetItems = await getTiersetAndTokenList()

    const tiersetItemIds = new Set(tiersetItems.map(item => item.id))

    const allItems = [...equipped, ...bags]

    return allItems.filter(item => tiersetItemIds.has(item.item.id))
}

export async function parseBagGearsFromSimc(simc: string): Promise<GearItem[]> {
    // Extract "Gear from Bags" section
    const gearSectionMatch = simc.match(/Gear from Bags[\s\S]*?(?=\n\n|$)/)
    if (!gearSectionMatch) {
        console.log("Unable to find 'Gear from Bags' section.")
        return []
    }

    const gearSection = gearSectionMatch[0]
    const itemLines = gearSection.split('\n').filter(line => line.includes('='))

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
            const wowItem = itemsInDb.find(i => i.id === itemId)

            if (wowItem == null) {
                console.log(
                    'parseBagGearsFromSimc: skipping bag item not in db: ' +
                        itemId +
                        ' https://www.wowhead.com/item=' +
                        itemId
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
                    season: evalRealSeason(wowItem, itemLevel),
                    specIds: wowItem.specIds
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

async function parseEquippedGearFromSimc(simc: string): Promise<GearItem[]> {
    // Define valid equipment slots
    const equippedSlots = [
        'head',
        'neck',
        'shoulder',
        'back',
        'chest',
        'wrist',
        'hands',
        'waist',
        'legs',
        'feet',
        'finger1',
        'finger2',
        'trinket1',
        'trinket2',
        'main_hand',
        'off_hand'
    ]

    // Create a regex pattern that matches any equipped slot followed by gear data
    // This will match lines like: head=,id=123456,bonus_id=1/2/3...
    const equippedSlotPattern = `(${equippedSlots.join('|')})`
    const equipmentRegex = new RegExp(`^${equippedSlotPattern}=.*?,id=(\\d+).*$`, 'gm')

    const itemsInDb: Item[] = await getItems()
    const items: GearItem[] = []
    let match: RegExpExecArray | null

    while ((match = equipmentRegex.exec(simc)) !== null) {
        const fullLine = match[0]
        const slotKey = match[1]
        const itemId = parseInt(match[2], 10)
        const bonusIdsString = fullLine.match(/bonus_id=([\d/]+)/)

        // Skip if no bonus_id (required for processing)
        if (!bonusIdsString) {
            continue
        }

        const bonusIds = bonusIdsString[1].split('/').map(Number)

        // Extract other properties from the full line
        const enchantIdMatch = fullLine.match(/enchant_id=([\d/]+)/)
        const gemIdMatch = fullLine.match(/gem_id=([\d/]+)/)
        const craftedStatsMatch = fullLine.match(/crafted_stats=([\d/]+)/)
        const craftingQualityMatch = fullLine.match(/crafting_quality=([\d/]+)/)

        const wowItem = itemsInDb.find(i => i.id === itemId)

        if (wowItem == null) {
            console.log(
                'parseEquippedGearFromSimc: skipping equipped item not in db: ' +
                    itemId +
                    ' https://www.wowhead.com/item=' +
                    itemId
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
                'parseEquippedGearFromSimc: skipping equipped item without ilvl: ' +
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
                season: evalRealSeason(wowItem, itemLevel),
                specIds: wowItem.specIds
            },
            source: 'equipped',
            equippedInSlot: wowItemEquippedSlotKeySchema.parse(slotKey),
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

    return items
}
