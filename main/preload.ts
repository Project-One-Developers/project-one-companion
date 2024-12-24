import { Droptimizer, NewDroptimizer } from "@/lib/types";
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
    api: {
        addDroptimizer: (
            droptimizer: NewDroptimizer,
        ): Promise<Droptimizer | null> => (
            ipcRenderer.invoke("add-droptimizer", droptimizer)
        ),
    },
});

export type IpcHandler = typeof handler;
