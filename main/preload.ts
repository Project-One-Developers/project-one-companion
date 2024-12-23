import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

require("dotenv").config();

const handler = {
    send(channel: string, value: unknown) {
        ipcRenderer.send(channel, value);
    },
    on(channel: string, callback: (...args: unknown[]) => void) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
            callback(...args);
        ipcRenderer.on(channel, subscription);

        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
};

contextBridge.exposeInMainWorld("ipc", {
    ...handler,
    getDatabaseUrl: () => process.env.DATABASE_URL,
});

export type IpcHandler = typeof handler;
