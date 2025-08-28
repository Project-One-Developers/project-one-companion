import { getUnixTimestamp } from '@shared/libs/date/date-utils'
import { evalRealSeason, parseItemTrack } from '@shared/libs/items/item-bonus-utils'
import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { GearItem, Item, WowItemEquippedSlotKey } from '@shared/types/types'
import { getItems } from '@storage/items/items.storage'
import {
    RaiderioItems,
    RaiderioResponse,
    raiderioResponseSchema
} from './characters-raiderio.schemas'

export async function fetchCharacterRaidProgress(
    characterName: string,
    realm: string
): Promise<RaiderioResponse> {
    const url = `https://raider.io/api/characters/eu/${realm}/${characterName}?season=season-tww-3&tier=34`

    const response = await fetch(url)

    if (!response.ok) {
        const errorMessage = `Failed to fetch ${characterName} from ${realm}: ${response.status} ${response.statusText}`
        console.log(
            {
                url,
                character: characterName,
                realm,
                status: response.status,
                statusText: response.statusText
            },
            errorMessage
        )

        throw new Error(errorMessage)
    }

    const data = await response.json()

    return raiderioResponseSchema.parse(data)
}

let itemsInDb: Item[] | null = null

export const parseRaiderioData = async (
    name: string,
    realm: string,
    raiderioCharData: RaiderioResponse
): Promise<CharacterRaiderio> => {
    itemsInDb = await getItems()

    const res: CharacterRaiderio = {
        name: name,
        realm: realm,
        race: raiderioCharData.characterDetails.character.race.name,
        characterId: raiderioCharData.characterDetails.character.id,
        p1SyncAt: getUnixTimestamp(),
        loggedOutAt: Math.floor(
            new Date(raiderioCharData.characterDetails.meta.loggedOutAt).getTime() / 1000
        ),
        averageItemLevel: raiderioCharData.characterDetails.itemDetails.item_level_equipped,
        itemUpdateAt: Math.floor(
            new Date(raiderioCharData.characterDetails.itemDetails.updated_at).getTime() / 1000
        ),
        itemsEquipped: createEquippedInfo(raiderioCharData.characterDetails.itemDetails.items),
        progress: raiderioCharData.characterRaidProgress
    }

    return res
}

function createEquippedInfo(itemsEquipped: RaiderioItems): GearItem[] {
    const res: GearItem[] = []

    const head = createGearPiece(
        itemsEquipped.head?.item_id,
        itemsEquipped.head?.item_level,
        itemsEquipped.head?.bonuses,
        itemsEquipped.head?.gems,
        itemsEquipped.head?.enchants,
        'head'
    )
    if (head != null) res.push(head)

    const neck = createGearPiece(
        itemsEquipped.neck?.item_id,
        itemsEquipped.neck?.item_level,
        itemsEquipped.neck?.bonuses,
        itemsEquipped.neck?.gems,
        itemsEquipped.neck?.enchants,
        'neck'
    )
    if (neck != null) res.push(neck)

    const shoulder = createGearPiece(
        itemsEquipped.shoulder?.item_id,
        itemsEquipped.shoulder?.item_level,
        itemsEquipped.shoulder?.bonuses,
        itemsEquipped.shoulder?.gems,
        itemsEquipped.shoulder?.enchants,
        'shoulder'
    )
    if (shoulder != null) res.push(shoulder)

    const back = createGearPiece(
        itemsEquipped.back?.item_id,
        itemsEquipped.back?.item_level,
        itemsEquipped.back?.bonuses,
        itemsEquipped.back?.gems,
        itemsEquipped.back?.enchants,
        'back'
    )
    if (back != null) res.push(back)

    const chest = createGearPiece(
        itemsEquipped.chest?.item_id,
        itemsEquipped.chest?.item_level,
        itemsEquipped.chest?.bonuses,
        itemsEquipped.chest?.gems,
        itemsEquipped.chest?.enchants,
        'chest'
    )
    if (chest != null) res.push(chest)

    const wrist = createGearPiece(
        itemsEquipped.wrist?.item_id,
        itemsEquipped.wrist?.item_level,
        itemsEquipped.wrist?.bonuses,
        itemsEquipped.wrist?.gems,
        itemsEquipped.wrist?.enchants,
        'wrist'
    )
    if (wrist != null) res.push(wrist)

    const hands = createGearPiece(
        itemsEquipped.hands?.item_id,
        itemsEquipped.hands?.item_level,
        itemsEquipped.hands?.bonuses,
        itemsEquipped.hands?.gems,
        itemsEquipped.hands?.enchants,
        'hands'
    )
    if (hands != null) res.push(hands)

    const waist = createGearPiece(
        itemsEquipped.waist?.item_id,
        itemsEquipped.waist?.item_level,
        itemsEquipped.waist?.bonuses,
        itemsEquipped.waist?.gems,
        itemsEquipped.waist?.enchants,
        'waist'
    )
    if (waist != null) res.push(waist)

    const legs = createGearPiece(
        itemsEquipped.legs?.item_id,
        itemsEquipped.legs?.item_level,
        itemsEquipped.legs?.bonuses,
        itemsEquipped.legs?.gems,
        itemsEquipped.legs?.enchants,
        'legs'
    )
    if (legs != null) res.push(legs)

    const feet = createGearPiece(
        itemsEquipped.feet?.item_id,
        itemsEquipped.feet?.item_level,
        itemsEquipped.feet?.bonuses,
        itemsEquipped.feet?.gems,
        itemsEquipped.feet?.enchants,
        'feet'
    )
    if (feet != null) res.push(feet)

    const finger1 = createGearPiece(
        itemsEquipped.finger1?.item_id,
        itemsEquipped.finger1?.item_level,
        itemsEquipped.finger1?.bonuses,
        itemsEquipped.finger1?.gems,
        itemsEquipped.finger1?.enchants,
        'finger1'
    )
    if (finger1 != null) res.push(finger1)

    const finger2 = createGearPiece(
        itemsEquipped.finger2?.item_id,
        itemsEquipped.finger2?.item_level,
        itemsEquipped.finger2?.bonuses,
        itemsEquipped.finger2?.gems,
        itemsEquipped.finger2?.enchants,
        'finger2'
    )
    if (finger2 != null) res.push(finger2)

    const trinket1 = createGearPiece(
        itemsEquipped.trinket1?.item_id,
        itemsEquipped.trinket1?.item_level,
        itemsEquipped.trinket1?.bonuses,
        itemsEquipped.trinket1?.gems,
        itemsEquipped.trinket1?.enchants,
        'trinket1'
    )
    if (trinket1 != null) res.push(trinket1)

    const trinket2 = createGearPiece(
        itemsEquipped.trinket2?.item_id,
        itemsEquipped.trinket2?.item_level,
        itemsEquipped.trinket2?.bonuses,
        itemsEquipped.trinket2?.gems,
        itemsEquipped.trinket2?.enchants,
        'trinket2'
    )
    if (trinket2 != null) res.push(trinket2)

    const mainHand = createGearPiece(
        itemsEquipped.mainhand?.item_id,
        itemsEquipped.mainhand?.item_level,
        itemsEquipped.mainhand?.bonuses,
        itemsEquipped.mainhand?.gems,
        itemsEquipped.mainhand?.enchants,
        'main_hand'
    )
    if (mainHand != null) res.push(mainHand)

    const offHand = createGearPiece(
        itemsEquipped.offhand?.item_id,
        itemsEquipped.offhand?.item_level,
        itemsEquipped.offhand?.bonuses,
        itemsEquipped.offhand?.gems,
        itemsEquipped.offhand?.enchants,
        'off_hand'
    )
    if (offHand != null) res.push(offHand)

    return res
}

function createGearPiece(
    itemId: number | undefined,
    ilvl: number | undefined,
    bonusIds: number[] | undefined,
    gemIds: number[] | undefined,
    enchantIds: number[] | undefined,
    equippedInSlot: WowItemEquippedSlotKey
): GearItem | null {
    if (!itemId || !ilvl || !itemsInDb) return null
    const wowItem = itemsInDb.find(i => i.id === itemId)
    if (wowItem == null) {
        console.log(
            `raiderio.createGearPiece: skipping equipped item in ${equippedInSlot} not in db: ` +
                itemId +
                ' https://www.wowhead.com/item=' +
                itemId
        )
        return null
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
        equippedInSlot: equippedInSlot,
        itemLevel: ilvl,
        bonusIds: bonusIds ?? null,
        itemTrack: bonusIds ? parseItemTrack(bonusIds) : null,
        gemIds: gemIds ?? null,
        enchantIds: enchantIds ?? null
    }
    return res
}
