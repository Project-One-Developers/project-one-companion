import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "../storage.config";
import { playerTable } from "../storage.schema";
import { parseAndValidate, takeFirstResult } from "../storage.utils";
import { playerSchema } from "./players.schemas";
import { Player } from "./players.types";

export const addPlayer = async (playerName: string) => {
    await db.insert(playerTable).values({
        id: uuid(),
        name: playerName,
    });
};

export const getPlayer = async (playerId: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, playerId))
        .then(takeFirstResult);

    return parseAndValidate(playerSchema, result);
};
