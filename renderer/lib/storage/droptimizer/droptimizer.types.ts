import { z } from "zod";
import { droptimizerSchema } from "./droptimizer.schemas";

export type Droptimizer = z.infer<typeof droptimizerSchema>;
