import { z } from "zod";
import {
    droptimizerItemSchema,
    droptimizerSchema,
    newDroptimizerSchema,
    newPlayerSchema,
    playerSchema,
    wowClassSchema,
} from "./schemas";

export type WowClass = z.infer<typeof wowClassSchema>;

export type DroptimizerItem = z.infer<typeof droptimizerItemSchema>;

export type Player = z.infer<typeof playerSchema>;
export type NewPlayer = z.infer<typeof newPlayerSchema>;

export type Droptimizer = z.infer<typeof droptimizerSchema>;
export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>;
