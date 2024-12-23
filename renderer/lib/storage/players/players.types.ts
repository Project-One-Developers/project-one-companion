import { z } from "zod";
import { playerSchema } from "./players.schemas";

export type Player = z.infer<typeof playerSchema>;
