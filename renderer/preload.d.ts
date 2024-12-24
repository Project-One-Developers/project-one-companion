import { ipc } from "../main/preload";

declare global {
    interface Window {
        ipc: typeof ipc;
    }
}

export {};
