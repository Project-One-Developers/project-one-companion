import { playerSchema } from "@/lib/schemas";
import { Player } from "@/lib/types";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "../storage.config";
import { playerTable } from "../storage.schema";
import { parseAndValidate, takeFirstResult } from "../storage.utils";

export const addPlayer = async (playerName: string) => {
    await db.insert(playerTable).values({
        id: uuid(),
        name: playerName,
    });
};

// TODO: do we want to return null or can we throw error in the 'storage'?
export const getPlayer = async (playerId: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, playerId))
        .then(takeFirstResult);

    return parseAndValidate(playerSchema, result);
};
