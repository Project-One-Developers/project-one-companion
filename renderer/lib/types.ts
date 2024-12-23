import { z } from "zod";
import { droptimizerItemSchema, wowClassSchema } from "./schemas";

export type WowClass = z.infer<typeof wowClassSchema>;

export type DroptimizerItem = z.infer<typeof droptimizerItemSchema>;
