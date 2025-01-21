import { z } from 'zod'

export const rawLootRecordSchema = z.object({
    player: z.string(),
    date: z.string(),
    time: z.string(),
    id: z.string(),
    item: z.string(),
    itemID: z.number(),
    itemString: z.string(),
    response: z.string(),
    votes: z.number(),
    class: z.string(),
    instance: z.string(),
    boss: z.string(),
    difficultyID: z.number(),
    mapID: z.number(),
    groupSize: z.number(),
    gear1: z.string(),
    gear2: z.string().nullable(),
    responseID: z.number(),
    isAwardReason: z.boolean(),
    subType: z.string(),
    equipLoc: z.string().nullable(),
    note: z.string().nullable(),
    owner: z.string()
})
