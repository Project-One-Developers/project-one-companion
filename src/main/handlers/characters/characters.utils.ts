import {
    charWowAuditStorageSchema,
    NewCharacterWowAudit
} from '@storage/players/characters.schemas'

export const fetchWowAuditData = async (apiKey: string): Promise<unknown> => {
    const responseJson = await fetch(`https://data.wowaudit.com/dragonflight/${apiKey}.json`)
    if (!responseJson.ok) {
        const errorMessage = `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    }
    return await responseJson.json()
}

const getNullSafeValue = (data: any[], index: number): any => {
    const value = data[index]
    return value === null || value === 0 || value === '' ? null : value
}

export const parseWowAuditData = (jsonData: unknown): NewCharacterWowAudit[] => {
    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
        throw new Error('Input data is not an array')
    }

    const wowAuditLastRefresh = jsonData[0][9]
    // Convert the string to a Date object
    const wowAuditLastRefreshDate = new Date(wowAuditLastRefresh)

    // Get the Unix timestamp (in seconds)
    const wowAuditLastRefreshunixTimestamp = Math.floor(wowAuditLastRefreshDate.getTime() / 1000)

    // we skip header

    const res = jsonData.slice(1).map((jsonData) => {
        const wowAuditChar = {
            wowauditLastModifiedUnixTs: wowAuditLastRefreshunixTimestamp, //  when wowaudit refreshed its internal data "2025-01-20 07:27:12 +0100"
            blizzardLastModifiedUnixTs: jsonData[128] / 1000, // blizzard_last_modified_unix_ts (millis)
            name: jsonData[0], // name
            realm: jsonData[2], // realm_slug
            race: jsonData[91], // race
            guildRank: jsonData[129], // guild_rank
            characterId: jsonData[133], // character_id

            averageItemLevel: String(jsonData[3]),

            // Current Equipped
            headIlvl: getNullSafeValue(jsonData, 6),
            headId: getNullSafeValue(jsonData, 7),
            neckIlvl: getNullSafeValue(jsonData, 10),
            neckId: getNullSafeValue(jsonData, 11),
            shoulderIlvl: getNullSafeValue(jsonData, 14),
            shoulderId: getNullSafeValue(jsonData, 15),
            backIlvl: getNullSafeValue(jsonData, 18),
            backId: getNullSafeValue(jsonData, 19),
            chestIlvl: getNullSafeValue(jsonData, 22),
            chestId: getNullSafeValue(jsonData, 23),
            wristIlvl: getNullSafeValue(jsonData, 26),
            wristId: getNullSafeValue(jsonData, 27),
            handsIlvl: getNullSafeValue(jsonData, 30),
            handsId: getNullSafeValue(jsonData, 31),
            waistIlvl: getNullSafeValue(jsonData, 34),
            waistId: getNullSafeValue(jsonData, 35),
            legsIlvl: getNullSafeValue(jsonData, 38),
            legsId: getNullSafeValue(jsonData, 39),
            feetIlvl: getNullSafeValue(jsonData, 42),
            feetId: getNullSafeValue(jsonData, 43),
            finger1Ilvl: getNullSafeValue(jsonData, 46),
            finger1Id: getNullSafeValue(jsonData, 47),
            finger2Ilvl: getNullSafeValue(jsonData, 50),
            finger2Id: getNullSafeValue(jsonData, 51),
            trinket1Ilvl: getNullSafeValue(jsonData, 54),
            trinket1Id: getNullSafeValue(jsonData, 55),
            trinket2Ilvl: getNullSafeValue(jsonData, 58),
            trinket2Id: getNullSafeValue(jsonData, 59),
            mainHandIlvl: getNullSafeValue(jsonData, 62),
            mainHandId: getNullSafeValue(jsonData, 63),
            offHandIlvl: getNullSafeValue(jsonData, 66),
            offHandId: getNullSafeValue(jsonData, 67),

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

            // Best Slot ever equipped
            bestHeadIlvl: getNullSafeValue(jsonData, 192),
            bestHeadId: getNullSafeValue(jsonData, 193),
            bestNeckIlvl: getNullSafeValue(jsonData, 196),
            bestNeckId: getNullSafeValue(jsonData, 197),
            bestShoulderIlvl: getNullSafeValue(jsonData, 200),
            bestShoulderId: getNullSafeValue(jsonData, 201),
            bestBackIlvl: getNullSafeValue(jsonData, 204),
            bestBackId: getNullSafeValue(jsonData, 205),
            bestChestIlvl: getNullSafeValue(jsonData, 208),
            bestChestId: getNullSafeValue(jsonData, 209),
            bestWristIlvl: getNullSafeValue(jsonData, 212),
            bestWristId: getNullSafeValue(jsonData, 213),
            bestHandsIlvl: getNullSafeValue(jsonData, 216),
            bestHandsId: getNullSafeValue(jsonData, 217),
            bestWaistIlvl: getNullSafeValue(jsonData, 220),
            bestWaistId: getNullSafeValue(jsonData, 221),
            bestLegsIlvl: getNullSafeValue(jsonData, 224),
            bestLegsId: getNullSafeValue(jsonData, 225),
            bestFeetIlvl: getNullSafeValue(jsonData, 228),
            bestFeetId: getNullSafeValue(jsonData, 229),
            bestFinger1Ilvl: getNullSafeValue(jsonData, 232),
            bestFinger1Id: getNullSafeValue(jsonData, 233),
            bestFinger2Ilvl: getNullSafeValue(jsonData, 236),
            bestFinger2Id: getNullSafeValue(jsonData, 237),
            bestTrinket1Ilvl: getNullSafeValue(jsonData, 240),
            bestTrinket1Id: getNullSafeValue(jsonData, 241),
            bestTrinket2Ilvl: getNullSafeValue(jsonData, 244),
            bestTrinket2Id: getNullSafeValue(jsonData, 245),
            bestMainHandIlvl: getNullSafeValue(jsonData, 248),
            bestMainHandId: getNullSafeValue(jsonData, 249),
            bestOffHandIlvl: getNullSafeValue(jsonData, 252),
            bestOffHandId: getNullSafeValue(jsonData, 253),

            // Tiersets info
            tiersetHeadIlvl: getNullSafeValue(jsonData, 265), // tiersetHeadIlvl
            tiersetShouldersIlvl: getNullSafeValue(jsonData, 266), // tiersetShouldersIlvl
            tiersetChestIlvl: getNullSafeValue(jsonData, 267), // tiersetChestIlvl
            tiersetHandsIlvl: getNullSafeValue(jsonData, 268), // tiersetHandsIlvl
            tiersetLegsIlvl: getNullSafeValue(jsonData, 269), // tiersetLegsIlvl
            tiersetHeadDiff: getNullSafeValue(jsonData, 270), // tier_head_difficulty
            tiersetShouldersDiff: getNullSafeValue(jsonData, 271), // tier_shoulder_difficulty
            tiersetChestDiff: getNullSafeValue(jsonData, 272), // tier_chest_difficulty
            tiersetHandsDiff: getNullSafeValue(jsonData, 273), // tier_hands_difficulty
            tiersetLegsDiff: getNullSafeValue(jsonData, 274) // tier_legs_difficulty
        }

        return charWowAuditStorageSchema.parse(wowAuditChar)
    })

    return res
}
