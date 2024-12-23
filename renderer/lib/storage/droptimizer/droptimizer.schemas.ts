import { z } from "zod";

export const droptimizerSchema = z
    .object({
        id: z.string(),
        url: z.string().url(),
        resultRaw: z.string(),
        date: z.number(),
        raidDifficulty: z.string(),
        fightstyle: z.string(),
        duration: z.number().min(1),
        nTargets: z.number().min(1),
    })
    .transform((data) => {
        return {
            id: data.id,
            url: data.url,
            resultRaw: data.resultRaw,
            date: data.date,
            raidDifficulty: data.raidDifficulty,
            fightInfo: {
                fightstyle: data.fightstyle,
                duration: data.duration,
                nTargets: data.nTargets,
            },
        };
    });

export type Droptimizer = z.infer<typeof droptimizerSchema>;
