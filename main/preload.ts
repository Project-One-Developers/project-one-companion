import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

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

contextBridge.exposeInMainWorld("ipc", {
    send: (channel: string, ...args: any[]) =>
        ipcRenderer.send(channel, ...args),
    invoke: (channel: string, ...args: any[]) =>
        ipcRenderer.invoke(channel, ...args),
    api: {
        getPlayer: (playerName: string) =>
            ipcRenderer.invoke("get-player", { playerName }),
        addPlayer: (playerName: string) =>
            ipcRenderer.invoke("add-player", { playerName }),
        getCharacter: (characterName: string) =>
            ipcRenderer.invoke("get-character", { characterName }),
    },
});
