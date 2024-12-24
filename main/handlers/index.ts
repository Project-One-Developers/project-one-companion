import { droptimizerHandlers } from "./droptimizer.handlers";
import { registerHandlers } from "./handlers.utils";

const allHandlers = [
    ...droptimizerHandlers,
    // Add more handler groups here
];

export const registerAllHandlers = () => {
    registerHandlers(allHandlers);
};
