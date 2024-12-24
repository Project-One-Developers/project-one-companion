import { NewDroptimizer } from "@/lib/types";
import { addDroptimizer } from "main/lib/storage/droptimizer/droptimizer.storage";
import { Handlers } from "./handlers.utils";

const addDroptimizerHandler = async (droptimizer: NewDroptimizer) => {
    console.log(`Received add-droptimizer with ${droptimizer}`);
    return await addDroptimizer(droptimizer);
};

export const droptimizerHandlers: Handlers[] = [
    {
        "add-droptimizer": addDroptimizerHandler,
    },
];
