import { z } from 'zod'

export const rawLootRecordSchema = z.object({
    player: z.string(),
    date: z.string(),
    time: z.string(),
    id: z.string(),
    item: z.string(),
    itemID: z.number(),
    itemString: z.string(),
    response: z.string().nullish(),
    votes: z.number().nullish(),
    class: z.string(),
    instance: z.string(),
    boss: z.string(),
    difficultyID: z.number(),
    mapID: z.number(),
    groupSize: z.number(),
    gear1: z.string().nullish(),
    gear2: z.string().nullish(),
    responseID: z.number().nullish().or(z.string().nullish()),
    isAwardReason: z.boolean(),
    subType: z.string(),
    equipLoc: z.string().nullish(),
    note: z.string().nullish(),
    owner: z.string().nullish()
})
