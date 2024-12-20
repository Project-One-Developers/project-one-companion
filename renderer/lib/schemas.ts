import { z } from "zod";

export const droptimizerCsvSchema = z.object({
  name: z.string(),
  dmg: z.string(),
});
