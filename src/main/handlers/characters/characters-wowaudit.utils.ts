import { CURRENT_SEASON } from '@shared/consts/wow.consts'
import {
    applyItemTrackByIlvlAndDelta,
    applyItemTrackByIlvlAndDiff,
    evalRealSeason
} from '@shared/libs/items/item-bonus-utils'
import { wowClassNameSchema } from '@shared/schemas/wow.schemas'
import {
    GearItem,
    Item,
    ItemTrack,
    WowClassName,
    WowItemEquippedSlotKey,
    WowItemSlotKey,
    WowRaidDifficulty
} from '@shared/types/types'
import { getItems } from '@storage/items/items.storage'
import {
    charWowAuditStorageSchema,
    NewCharacterWowAudit
} from '@storage/players/characters-wowaudit.schemas'

export const fetchWowAuditData = async (apiKey: string): Promise<unknown> => {
    const responseJson = await fetch(`https://data.wowaudit.com/dragonflight/${apiKey}.json`)
    if (!responseJson.ok) {
        throw new Error(
            `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        )
    }
    return await responseJson.json()
}

const getNullSafeValue = (data: any[], index: number): any => {
    const value = data[index]
    return value === null || value === 0 || value === '' || value === '-' ? null : value
}

let itemsInDb: Item[] | null = null

export const parseWowAuditData = async (jsonData: unknown): Promise<NewCharacterWowAudit[]> => {
    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
        throw new Error('Input data is not an array')
    }

    const wowAuditLastRefresh = jsonData[0][9]
    // Convert the string to a Date object
    const wowAuditLastRefreshDate = new Date(wowAuditLastRefresh)

    // Get the Unix timestamp (in seconds)
    const wowAuditLastRefreshunixTimestamp = Math.floor(wowAuditLastRefreshDate.getTime() / 1000)

    itemsInDb = await getItems()

    // we skip header
    const res = jsonData.slice(1).map(jsonData => {
        const className: WowClassName = wowClassNameSchema.parse(jsonData[1])
        const wowAuditChar = {
            wowauditLastModifiedUnixTs: wowAuditLastRefreshunixTimestamp, //  when wowaudit refreshed its internal data "2025-01-20 07:27:12 +0100"
            blizzardLastModifiedUnixTs: jsonData[128] / 1000, // blizzard_last_modified_unix_ts (millis)
            name: jsonData[0], // name
            realm: jsonData[2], // realm_slug
            race: jsonData[91], // race
            guildRank: jsonData[129], // guild_rank
            characterId: jsonData[133], // character_id

            averageItemLevel: String(jsonData[3]),

            // Checks
            weekMythicDungeons: jsonData[105], // week_mythic_dungeons
            emptySockets: jsonData[84], // empty_sockets
            enchantQualityWrist: getNullSafeValue(jsonData, 84), // enchant_quality_wrist
            enchantQualityLegs: getNullSafeValue(jsonData, 85), // enchant_quality_legs
            enchantQualityMainHand: getNullSafeValue(jsonData, 86), // enchant_quality_main_hand
            enchantQualityOffHand: getNullSafeValue(jsonData, 87), // enchant_quality_off_hand
            enchantQualityFinger1: getNullSafeValue(jsonData, 88), // enchant_quality_finger_1
            enchantQualityFinger2: getNullSafeValue(jsonData, 89), // enchant_quality_finger_2
            enchantQualityBack: getNullSafeValue(jsonData, 121), // enchant_quality_back

            enchantQualityChest: getNullSafeValue(jsonData, 122), // enchant_quality_chest

            enchantNameBack: getNullSafeValue(jsonData, 124),
            enchantNameChest: getNullSafeValue(jsonData, 125),
            enchantNameWrist: getNullSafeValue(jsonData, 130),
            enchantNameLegs: getNullSafeValue(jsonData, 131),
            enchantNameFeet: getNullSafeValue(jsonData, 126),
            enchantNameFinger1: getNullSafeValue(jsonData, 118),
            enchantNameFinger2: getNullSafeValue(jsonData, 119),
            enchantNameMainHand: getNullSafeValue(jsonData, 116),
            enchantNameOffHand: getNullSafeValue(jsonData, 117),

            enchantQualityFeet: getNullSafeValue(jsonData, 123), // enchant_quality_feet

            highestIlvlEverEquipped: String(jsonData[132]), // highest_ilvl_ever_equipped

            // great vault
            greatVaultSlot1: getNullSafeValue(jsonData, 174), // great_vault_slot_1
            greatVaultSlot2: getNullSafeValue(jsonData, 175), // great_vault_slot_2
            greatVaultSlot3: getNullSafeValue(jsonData, 176), // great_vault_slot_3
            greatVaultSlot4: getNullSafeValue(jsonData, 177), // great_vault_slot_4
            greatVaultSlot5: getNullSafeValue(jsonData, 178), // great_vault_slot_5
            greatVaultSlot6: getNullSafeValue(jsonData, 179), // great_vault_slot_6
            greatVaultSlot7: getNullSafeValue(jsonData, 180), // great_vault_slot_7
            greatVaultSlot8: getNullSafeValue(jsonData, 181), // great_vault_slot_8
            greatVaultSlot9: getNullSafeValue(jsonData, 182), // great_vault_slot_9

            // Current Equipped
            itemsEquipped: createEquippedInfo(jsonData),
            // Best Slot ever equipped
            bestItemsEquipped: createBestEquippedInfo(jsonData),
            // Tiersets info
            tiersetInfo: createTiersetInfo(className, jsonData)
        }

        return charWowAuditStorageSchema.parse(wowAuditChar)
    })

    return res
}

function createEquippedInfo(jsonData: any): GearItem[] {
    const res: GearItem[] = []

    const head = createGearPiece(
        Number(getNullSafeValue(jsonData, 7)),
        Number(getNullSafeValue(jsonData, 6)),
        getNullSafeValue(jsonData, 363),
        'head'
    )
    if (head != null) res.push(head)

    const neck = createGearPiece(
        Number(getNullSafeValue(jsonData, 11)),
        Number(getNullSafeValue(jsonData, 10)),
        getNullSafeValue(jsonData, 364),
        'neck'
    )
    if (neck != null) res.push(neck)

    const shoulder = createGearPiece(
        Number(getNullSafeValue(jsonData, 15)),
        Number(getNullSafeValue(jsonData, 14)),
        getNullSafeValue(jsonData, 365),
        'shoulder'
    )
    if (shoulder != null) res.push(shoulder)

    const back = createGearPiece(
        Number(getNullSafeValue(jsonData, 19)),
        Number(getNullSafeValue(jsonData, 18)),
        getNullSafeValue(jsonData, 366),
        'back'
    )
    if (back != null) res.push(back)

    const chest = createGearPiece(
        Number(getNullSafeValue(jsonData, 23)),
        Number(getNullSafeValue(jsonData, 22)),
        getNullSafeValue(jsonData, 367),
        'chest'
    )
    if (chest != null) res.push(chest)

    const wrist = createGearPiece(
        Number(getNullSafeValue(jsonData, 27)),
        Number(getNullSafeValue(jsonData, 26)),
        getNullSafeValue(jsonData, 368),
        'wrist'
    )
    if (wrist != null) res.push(wrist)

    const hands = createGearPiece(
        Number(getNullSafeValue(jsonData, 31)),
        Number(getNullSafeValue(jsonData, 30)),
        getNullSafeValue(jsonData, 369),
        'hands'
    )
    if (hands != null) res.push(hands)

    const waist = createGearPiece(
        Number(getNullSafeValue(jsonData, 35)),
        Number(getNullSafeValue(jsonData, 34)),
        getNullSafeValue(jsonData, 370),
        'waist'
    )
    if (waist != null) res.push(waist)

    const legs = createGearPiece(
        Number(getNullSafeValue(jsonData, 39)),
        Number(getNullSafeValue(jsonData, 38)),
        getNullSafeValue(jsonData, 371),
        'legs'
    )
    if (legs != null) res.push(legs)

    const feet = createGearPiece(
        Number(getNullSafeValue(jsonData, 43)),
        Number(getNullSafeValue(jsonData, 42)),
        getNullSafeValue(jsonData, 372),
        'feet'
    )
    if (feet != null) res.push(feet)

    const finger1 = createGearPiece(
        Number(getNullSafeValue(jsonData, 47)),
        Number(getNullSafeValue(jsonData, 46)),
        getNullSafeValue(jsonData, 373),
        'finger1'
    )
    if (finger1 != null) res.push(finger1)

    const finger2 = createGearPiece(
        Number(getNullSafeValue(jsonData, 51)),
        Number(getNullSafeValue(jsonData, 50)),
        getNullSafeValue(jsonData, 374),
        'finger2'
    )
    if (finger2 != null) res.push(finger2)

    const trinket1 = createGearPiece(
        Number(getNullSafeValue(jsonData, 55)),
        Number(getNullSafeValue(jsonData, 54)),
        getNullSafeValue(jsonData, 375),
        'trinket1'
    )
    if (trinket1 != null) res.push(trinket1)

    const trinket2 = createGearPiece(
        Number(getNullSafeValue(jsonData, 59)),
        Number(getNullSafeValue(jsonData, 58)),
        getNullSafeValue(jsonData, 376),
        'trinket2'
    )
    if (trinket2 != null) res.push(trinket2)

    const mainHand = createGearPiece(
        Number(getNullSafeValue(jsonData, 63)),
        Number(getNullSafeValue(jsonData, 62)),
        getNullSafeValue(jsonData, 377),
        'main_hand'
    )
    if (mainHand != null) res.push(mainHand)

    const offHand = createGearPiece(
        Number(getNullSafeValue(jsonData, 67)),
        Number(getNullSafeValue(jsonData, 66)),
        getNullSafeValue(jsonData, 378),
        'off_hand'
    )
    if (offHand != null) res.push(offHand)

    return res
}

function createTiersetInfo(className: WowClassName, jsonData: any): GearItem[] {
    const res: GearItem[] = []

    const head = createTiersetGearPiece(
        className,
        'head',
        Number(getNullSafeValue(jsonData, 265)),
        getNullSafeValue(jsonData, 270)
    )
    if (head != null) res.push(head)

    const shoulders = createTiersetGearPiece(
        className,
        'shoulder',
        Number(getNullSafeValue(jsonData, 266)),
        getNullSafeValue(jsonData, 271)
    )
    if (shoulders != null) res.push(shoulders)

    const chest = createTiersetGearPiece(
        className,
        'chest',
        Number(getNullSafeValue(jsonData, 267)),
        getNullSafeValue(jsonData, 272)
    )
    if (chest != null) res.push(chest)

    const hands = createTiersetGearPiece(
        className,
        'hands',
        Number(getNullSafeValue(jsonData, 268)),
        getNullSafeValue(jsonData, 273)
    )
    if (hands != null) res.push(hands)

    const legs = createTiersetGearPiece(
        className,
        'legs',
        Number(getNullSafeValue(jsonData, 269)),
        getNullSafeValue(jsonData, 274)
    )
    if (legs != null) res.push(legs)

    return res
}

function createBestEquippedInfo(jsonData: any): GearItem[] {
    const res: GearItem[] = []

    const head = createGearPiece(
        Number(getNullSafeValue(jsonData, 193)),
        Number(getNullSafeValue(jsonData, 192)),
        null,
        'head'
    )
    if (head != null) res.push(head)

    const neck = createGearPiece(
        Number(getNullSafeValue(jsonData, 197)),
        Number(getNullSafeValue(jsonData, 196)),
        null,
        'neck'
    )
    if (neck != null) res.push(neck)

    const shoulder = createGearPiece(
        Number(getNullSafeValue(jsonData, 201)),
        Number(getNullSafeValue(jsonData, 200)),
        null,
        'shoulder'
    )
    if (shoulder != null) res.push(shoulder)

    const back = createGearPiece(
        Number(getNullSafeValue(jsonData, 205)),
        Number(getNullSafeValue(jsonData, 204)),
        null,
        'back'
    )
    if (back != null) res.push(back)

    const chest = createGearPiece(
        Number(getNullSafeValue(jsonData, 209)),
        Number(getNullSafeValue(jsonData, 208)),
        null,
        'chest'
    )
    if (chest != null) res.push(chest)

    const wrist = createGearPiece(
        Number(getNullSafeValue(jsonData, 213)),
        Number(getNullSafeValue(jsonData, 212)),
        null,
        'wrist'
    )
    if (wrist != null) res.push(wrist)

    const hands = createGearPiece(
        Number(getNullSafeValue(jsonData, 217)),
        Number(getNullSafeValue(jsonData, 216)),
        null,
        'hands'
    )
    if (hands != null) res.push(hands)

    const waist = createGearPiece(
        Number(getNullSafeValue(jsonData, 221)),
        Number(getNullSafeValue(jsonData, 220)),
        null,
        'waist'
    )
    if (waist != null) res.push(waist)

    const legs = createGearPiece(
        Number(getNullSafeValue(jsonData, 225)),
        Number(getNullSafeValue(jsonData, 224)),
        null,
        'legs'
    )
    if (legs != null) res.push(legs)

    const feet = createGearPiece(
        Number(getNullSafeValue(jsonData, 229)),
        Number(getNullSafeValue(jsonData, 228)),
        null,
        'feet'
    )
    if (feet != null) res.push(feet)

    const finger1 = createGearPiece(
        Number(getNullSafeValue(jsonData, 233)),
        Number(getNullSafeValue(jsonData, 232)),
        null,
        'finger1'
    )
    if (finger1 != null) res.push(finger1)

    const finger2 = createGearPiece(
        Number(getNullSafeValue(jsonData, 237)),
        Number(getNullSafeValue(jsonData, 236)),
        null,
        'finger2'
    )
    if (finger2 != null) res.push(finger2)

    const trinket1 = createGearPiece(
        Number(getNullSafeValue(jsonData, 241)),
        Number(getNullSafeValue(jsonData, 240)),
        null,
        'trinket1'
    )
    if (trinket1 != null) res.push(trinket1)

    const trinket2 = createGearPiece(
        Number(getNullSafeValue(jsonData, 245)),
        Number(getNullSafeValue(jsonData, 244)),
        null,
        'trinket2'
    )
    if (trinket2 != null) res.push(trinket2)

    const mainHand = createGearPiece(
        Number(getNullSafeValue(jsonData, 249)),
        Number(getNullSafeValue(jsonData, 248)),
        null,
        'main_hand'
    )
    if (mainHand != null) res.push(mainHand)

    const offHand = createGearPiece(
        Number(getNullSafeValue(jsonData, 253)),
        Number(getNullSafeValue(jsonData, 252)),
        null,
        'off_hand'
    )
    if (offHand != null) res.push(offHand)

    return res
}

function wowAuditDiffToRealDiff(diff: string | null): WowRaidDifficulty | null {
    if (!diff) return null

    switch (diff) {
        case 'H':
            return 'Heroic'
        case 'N':
            return 'Normal'
        case 'M':
            return 'Mythic'
        case 'R':
            return 'LFR'
        default:
            throw new Error('wowAuditDiffToRealDiff: diff not mapped - ' + diff)
    }
}

function createTiersetGearPiece(
    className: WowClassName,
    slotKey: WowItemSlotKey,
    ilvl: number | null,
    diff: string | null
): GearItem | null {
    if (!className || !ilvl || !itemsInDb || !slotKey || !diff) return null

    const wowItem = itemsInDb.find(
        i =>
            i.tierset === true &&
            i.slotKey === slotKey &&
            i.classes?.includes(className) &&
            i.season === CURRENT_SEASON
    )
    if (wowItem == null) {
        console.log(
            'wowaudit.createTiersetGearPiece: skipping tierset not detectable for: ' +
                className +
                ' - ' +
                slotKey
        )
        return null
    }

    const itemDiff = wowAuditDiffToRealDiff(diff)
    const bonusIds: number[] = []
    const itemTrack = itemDiff ? applyItemTrackByIlvlAndDiff(bonusIds, ilvl, itemDiff) : null

    const res: GearItem = {
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
            season: evalRealSeason(wowItem, ilvl),
            specIds: wowItem.specIds
        },
        source: 'equipped',
        itemLevel: ilvl,
        bonusIds: bonusIds,
        itemTrack,
        gemIds: null,
        enchantIds: null
    }
    return res
}

function createGearPiece(
    itemId: number | null,
    ilvl: number | null,
    deltaString: string | null,
    equippedInSlot: WowItemEquippedSlotKey | null
): GearItem | null {
    if (!itemId || !ilvl || !itemsInDb) return null
    const wowItem = itemsInDb.find(i => i.id === itemId)
    if (wowItem == null) {
        console.log(
            'wowaudit.createGearPiece: skipping equipped item not in db: ' +
                itemId +
                ' https://www.wowhead.com/item=' +
                itemId
        )
        return null
    }

    const bonusIds: number[] = []
    let itemTrack: ItemTrack | null = null
    if (deltaString) {
        // wow audit delta is like "4/6".
        // In this example delta is 2 and we need to deduce actual item track by ilvl and delta
        const current = Number(deltaString.split('/')[0])
        const total = Number(deltaString.split('/')[1])
        if (current && total) {
            itemTrack = applyItemTrackByIlvlAndDelta(bonusIds, ilvl, total - current)
        }
    }

    const res: GearItem = {
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
            season: evalRealSeason(wowItem, ilvl),
            specIds: wowItem.specIds
        },
        source: 'equipped',
        equippedInSlot: equippedInSlot ?? undefined,
        itemLevel: ilvl,
        bonusIds: bonusIds,
        itemTrack: itemTrack,
        gemIds: null,
        enchantIds: null
    }
    return res
}
