import { IpcHandler } from "../main/preload";

declare global {
    interface Window {
        ipc: IpcHandler & {
            api: ApiHandler;
        };
    }

    interface ApiHandler {
        getPlayer: (playerName: string) => Promise<any>;
        addPlayer: (playerName: string) => Promise<any>;
        getCharacter: (characterName: string) => Promise<any>;
    }
}
