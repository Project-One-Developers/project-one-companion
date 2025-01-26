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

            // Checks
            weekMythicDungeons: jsonData[105], // week_mythic_dungeons
            emptySockets: jsonData[84], // empty_sockets
            enchantQualityWrist: getNullSafeValue(jsonData, 85), // enchant_quality_wrist
            enchantQualityLegs: getNullSafeValue(jsonData, 86), // enchant_quality_legs
            enchantQualityMainHand: getNullSafeValue(jsonData, 87), // enchant_quality_main_hand
            enchantQualityOffHand: getNullSafeValue(jsonData, 88), // enchant_quality_off_hand
            enchantQualityFinger1: getNullSafeValue(jsonData, 89), // enchant_quality_finger_1
            enchantQualityFinger2: getNullSafeValue(jsonData, 90), // enchant_quality_finger_2
            enchantQualityBack: getNullSafeValue(jsonData, 121), // enchant_quality_back
            enchantQualityChest: getNullSafeValue(jsonData, 122), // enchant_quality_chest
            enchantQualityFeet: getNullSafeValue(jsonData, 123), // enchant_quality_feet

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

            // Tiersets info
            tiersetHeadIlvl: jsonData[265], // tiersetHeadIlvl
            tiersetShouldersIlvl: jsonData[266], // tiersetShouldersIlvl
            tiersetChestIlvl: jsonData[267], // tiersetChestIlvl
            tiersetHandsIlvl: jsonData[268], // tiersetHandsIlvl
            tiersetLegsIlvl: jsonData[269], // tiersetLegsIlvl
            tiersetHeadDiff: jsonData[270], // tier_head_difficulty
            tiersetShouldersDiff: jsonData[271], // tier_shoulder_difficulty
            tiersetChestDiff: jsonData[272], // tier_chest_difficulty
            tiersetHandsDiff: jsonData[273], // tier_hands_difficulty
            tiersetLegsDiff: jsonData[274], // tier_legs_difficulty

            // Best Slot ever equipped
            highestIlvlEverEquipped: String(jsonData[132]), // highest_ilvl_ever_equipped
            bestHeadIlvl: getNullSafeValue(jsonData, 192),
            bestHeadId: getNullSafeValue(jsonData, 193),
            bestHeadName: getNullSafeValue(jsonData, 194),
            bestHeadQuality: getNullSafeValue(jsonData, 195),
            bestNeckIlvl: getNullSafeValue(jsonData, 196),
            bestNeckId: getNullSafeValue(jsonData, 197),
            bestNeckName: getNullSafeValue(jsonData, 198),
            bestNeckQuality: getNullSafeValue(jsonData, 199),
            bestShoulderIlvl: getNullSafeValue(jsonData, 200),
            bestShoulderId: getNullSafeValue(jsonData, 201),
            bestShoulderName: getNullSafeValue(jsonData, 202),
            bestShoulderQuality: getNullSafeValue(jsonData, 203),
            bestBackIlvl: getNullSafeValue(jsonData, 204),
            bestBackId: getNullSafeValue(jsonData, 205),
            bestBackName: getNullSafeValue(jsonData, 206),
            bestBackQuality: getNullSafeValue(jsonData, 207),
            bestChestIlvl: getNullSafeValue(jsonData, 208),
            bestChestId: getNullSafeValue(jsonData, 209),
            bestChestName: getNullSafeValue(jsonData, 210),
            bestChestQuality: getNullSafeValue(jsonData, 211),
            bestWristIlvl: getNullSafeValue(jsonData, 212),
            bestWristId: getNullSafeValue(jsonData, 213),
            bestWristName: getNullSafeValue(jsonData, 214),
            bestWristQuality: getNullSafeValue(jsonData, 215),
            bestHandsIlvl: getNullSafeValue(jsonData, 216),
            bestHandsId: getNullSafeValue(jsonData, 217),
            bestHandsName: getNullSafeValue(jsonData, 218),
            bestHandsQuality: getNullSafeValue(jsonData, 219),
            bestWaistIlvl: getNullSafeValue(jsonData, 220),
            bestWaistId: getNullSafeValue(jsonData, 221),
            bestWaistName: getNullSafeValue(jsonData, 222),
            bestWaistQuality: getNullSafeValue(jsonData, 223),
            bestLegsIlvl: getNullSafeValue(jsonData, 224),
            bestLegsId: getNullSafeValue(jsonData, 225),
            bestLegsName: getNullSafeValue(jsonData, 226),
            bestLegsQuality: getNullSafeValue(jsonData, 227),
            bestFeetIlvl: getNullSafeValue(jsonData, 228),
            bestFeetId: getNullSafeValue(jsonData, 229),
            bestFeetName: getNullSafeValue(jsonData, 230),
            bestFeetQuality: getNullSafeValue(jsonData, 231),
            bestFinger1Ilvl: getNullSafeValue(jsonData, 232),
            bestFinger1Id: getNullSafeValue(jsonData, 233),
            bestFinger1Name: getNullSafeValue(jsonData, 234),
            bestFinger1Quality: getNullSafeValue(jsonData, 235),
            bestFinger2Ilvl: getNullSafeValue(jsonData, 236),
            bestFinger2Id: getNullSafeValue(jsonData, 237),
            bestFinger2Name: getNullSafeValue(jsonData, 238),
            bestFinger2Quality: getNullSafeValue(jsonData, 239),
            bestTrinket1Ilvl: getNullSafeValue(jsonData, 240),
            bestTrinket1Id: getNullSafeValue(jsonData, 241),
            bestTrinket1Name: getNullSafeValue(jsonData, 242),
            bestTrinket1Quality: getNullSafeValue(jsonData, 243),
            bestTrinket2Ilvl: getNullSafeValue(jsonData, 244),
            bestTrinket2Id: getNullSafeValue(jsonData, 245),
            bestTrinket2Name: getNullSafeValue(jsonData, 246),
            bestTrinket2Quality: getNullSafeValue(jsonData, 247),
            bestMainHandIlvl: getNullSafeValue(jsonData, 248),
            bestMainHandId: getNullSafeValue(jsonData, 249),
            bestMainHandName: getNullSafeValue(jsonData, 250),
            bestMainHandQuality: getNullSafeValue(jsonData, 251),
            bestOffHandIlvl: getNullSafeValue(jsonData, 252),
            bestOffHandId: getNullSafeValue(jsonData, 253),
            bestOffHandName: getNullSafeValue(jsonData, 254),
            bestOffHandQuality: getNullSafeValue(jsonData, 255)
        }

        return charWowAuditStorageSchema.parse(wowAuditChar)
    })

    return res
}
