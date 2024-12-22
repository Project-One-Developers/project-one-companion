import { z } from "zod";
import { wowClassSchema } from "./schemas";

export type WowClass = z.infer<typeof wowClassSchema>;
