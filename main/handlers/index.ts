import { droptimizerHandlers } from "./droptimizer.handlers";
import { registerHandlers } from "./handlers.utils";

export const registerAllHandlers = () => {
    registerHandlers([
        ...droptimizerHandlers,
        // Add more handler groups here
    ]);
};
