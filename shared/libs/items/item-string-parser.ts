import { z } from 'zod'

export const itemStringDataSchema = z.object({
    itemID: z.number(),
    enchantID: z.number(),
    gemIDs: z.array(z.number()).length(4),
    suffixID: z.number(),
    uniqueID: z.number(),
    linkLevel: z.number(),
    specializationID: z.number(),
    upgradeId: z.number(),
    instanceDifficultyId: z.number(),
    numBonusIds: z.number(),
    bonusIds: z.array(z.number()),
    upgradeValue: z.number().optional()
})

export type ItemStringData = z.infer<typeof itemStringDataSchema>

export const parseItemString = (itemString: string): ItemStringData => {
    const parts = itemString.split(':').map(Number)

    if (parts.length < 13) {
        throw new Error('Invalid item string: insufficient parts')
    }

    // First value is "item" prefix
    const [
        ,
        itemID,
        enchantID,
        gemId1,
        gemId2,
        gemId3,
        gemId4,
        suffixID,
        uniqueID,
        linkLevel,
        specializationID,
        upgradeId,
        instanceDifficultyId, // actually itemContext ( like BoE, WuE, etc)
        numBonusIds,
        ...rest
    ] = parts

    // Extract bonus IDs based on the numBonusIds value
    const bonusIds = rest.slice(0, numBonusIds)
    const upgradeValue = rest[numBonusIds]

    // Create the raw object
    const rawItemInfo: ItemStringData = {
        itemID,
        enchantID,
        gemIDs: [gemId1, gemId2, gemId3, gemId4],
        suffixID,
        uniqueID,
        linkLevel,
        specializationID,
        upgradeId,
        instanceDifficultyId,
        numBonusIds,
        bonusIds,
        upgradeValue
    }

    // Parse and validate with Zod schema
    return itemStringDataSchema.parse(rawItemInfo)
}

export const getItemBonusString = (itemStringData: ItemStringData): string =>
    itemStringData.bonusIds.join(':')
