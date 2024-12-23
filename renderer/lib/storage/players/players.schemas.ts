import { characterSchema } from "@/lib/schemas";
import { z } from "zod";

export const playerSchema = z.object({
    playerName: z.string(),
    characters: z.array(characterSchema),
});
