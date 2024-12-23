import { playerSchema } from "@/lib/schemas";
import { NewPlayer, Player } from "@/lib/types";
import { newUUID } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { db } from "../storage.config";
import { playerTable } from "../storage.schema";
import { parseAndValidate, takeFirstResult } from "../storage.utils";

export const addPlayer = async (player: NewPlayer): Promise<Player | null> => {
    const result = await db
        .insert(playerTable)
        .values({
            id: newUUID(),
            name: player.playerName,
        })
        .returning()
        .execute()
        .then(takeFirstResult);

    return parseAndValidate(playerSchema, result);
};

export const getPlayer = async (playerId: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, playerId))
        .then(takeFirstResult);

    return parseAndValidate(playerSchema, result);
};
