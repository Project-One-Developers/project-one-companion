import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { playerSchema } from "../schemas";
import { Player } from "../types";
import { db } from "./storage.config";
import { playerTable } from "./storage.schema";
import { parseAndValidate } from "./storage.utils";

export const addPlayer = async (playerName: string) => {
    await db.insert(playerTable).values({
        id: uuid(),
        name: playerName,
    });
};

// TODO: do we want to return null or can we throw error in the 'storage'?
export const getPlayer = async (playerId: string): Promise<Player | null> => {
    const playerRecord = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, playerId));

    // TODO: is it needed to check for empty array?
    return parseAndValidate(playerSchema, playerRecord[0]);
};
