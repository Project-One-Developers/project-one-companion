import { z } from "zod";
import { droptimizerItemSchema, playerSchema, wowClassSchema } from "./schemas";

export type WowClass = z.infer<typeof wowClassSchema>;

export type DroptimizerItem = z.infer<typeof droptimizerItemSchema>;

export type Player = z.infer<typeof playerSchema>;
