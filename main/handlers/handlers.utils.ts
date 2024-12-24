import { ipcMain } from "electron";

type Handler = (...args: any[]) => Promise<any>;

export const registerHandlers = (handlers: Record<string, Handler>) => {
    for (const [channel, handler] of Object.entries(handlers)) {
        ipcMain.handle(channel, async (event, ...args) => handler(...args));
    }
};
