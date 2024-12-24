import { addDroptimizerHandler } from "./droptimizer.handlers";
import { registerHandlers } from "./handlers.utils";

const allHandlers = [
    {
        "add-droptimizer": addDroptimizerHandler,
    },
];

export const registerAllHandlers = () => {
    registerHandlers(allHandlers);
};
