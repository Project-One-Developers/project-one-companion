import { NewCharacter, Player } from "@/lib/types";
import { addCharacter } from "main/lib/storage/players/players.storage";

export const addCharacterHandler = async (
    character: NewCharacter,
): Promise<Player | null> => {
    return await addCharacter(character);
};
