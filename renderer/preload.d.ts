import { NewDroptimizer } from "@/lib/types";
import { IpcHandler } from "../main/preload";

declare global {
    interface Window {
        ipc: IpcHandler & {
            api: ApiHandler;
        };
    }

    interface ApiHandler {
        addDroptimizer: (droptimizer: NewDroptimizer) => Promise<any>;
    }
}
