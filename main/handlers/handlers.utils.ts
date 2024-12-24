import { ipcMain } from "electron";

type HandlerFunction = (...args: any[]) => Promise<any>;

export type Handlers = Record<string, HandlerFunction>;

export const registerHandlers = (handlersArray: Handlers[]) => {
    const handlers = Object.assign({}, ...handlersArray); // Flatten the array into a single object

    for (const [channel, handler] of Object.entries(handlers)) {
        // Assert that handler is of type HandlerFunction
        ipcMain.handle(channel, async (event, ...args) =>
            (handler as HandlerFunction)(...args),
        );
    }
};
