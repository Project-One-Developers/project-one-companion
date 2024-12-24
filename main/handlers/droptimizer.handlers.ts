import { NewDroptimizer } from "@/lib/types";
import { addDroptimizer } from "main/lib/storage/droptimizer/droptimizer.storage";
import { registerHandlers } from "./handlers.utils";

const addDroptimizerHandler = async (droptimizer: NewDroptimizer) => {
    return await addDroptimizer(droptimizer);
};

export const registerDroptimizerHandlers = () => {
    registerHandlers({
        "add-droptimizer": addDroptimizerHandler,
    });
};
