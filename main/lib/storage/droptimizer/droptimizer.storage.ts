import { Droptimizer, NewDroptimizer } from "@/lib/types";
import { eq } from "drizzle-orm";
import { newUUID } from "main/lib/utils";
import { db } from "../storage.config";
import { droptimizerTable } from "../storage.schema";
import { parseAndValidate, takeFirstResult } from "../storage.utils";
import { droptimizerModelSchema } from "./droptimizer.schemas";

export const getDroptimizer = async (
    droptimizerId: string,
): Promise<Droptimizer | null> => {
    const result = await db
        .select()
        .from(droptimizerTable)
        .where(eq(droptimizerTable.id, droptimizerId))
        .then(takeFirstResult);

    return parseAndValidate(droptimizerModelSchema, result);
};

export const addDroptimizer = async (
    droptimizer: NewDroptimizer,
): Promise<Droptimizer | null> => {
    const result = await db
        .insert(droptimizerTable)
        .values({
            id: newUUID(),
            url: droptimizer.url,
            resultRaw: droptimizer.resultRaw,
            date: droptimizer.date,
            raidDifficulty: droptimizer.raidDifficulty,
            fightStyle: droptimizer.fightInfo.fightstyle,
            duration: droptimizer.fightInfo.duration,
            nTargets: droptimizer.fightInfo.nTargets,
            characterName: droptimizer.characterName,
        })
        .returning()
        .execute()
        .then(takeFirstResult);

    return parseAndValidate(droptimizerModelSchema, result);
};
