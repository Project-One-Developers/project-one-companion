import { Droptimizer } from "@/lib/types";
import { ipcRenderer, IpcRendererEvent } from "electron";

export const ipc = {
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
    api: {
        addDroptimizer(url: string): Promise<Droptimizer | null> {
            return ipcRenderer.invoke("add-droptimizer", url);
        },
    },
};
