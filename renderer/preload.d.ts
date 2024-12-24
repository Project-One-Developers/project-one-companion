import { ipc } from "../main/ipc";

declare global {
    interface Window {
        ipc: typeof ipc;
    }
}

export {};
