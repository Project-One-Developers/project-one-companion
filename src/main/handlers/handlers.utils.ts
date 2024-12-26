/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipcMain } from 'electron'

type HandlerFunction = (...args: any[]) => Promise<any>

export type Handlers = Record<string, HandlerFunction>

export const registerHandlers = (handlers: Record<string, HandlerFunction>): void => {
    for (const [channel, handler] of Object.entries(handlers)) {
        // The first argument is the event, which isn't needed
        ipcMain.handle(channel, async (_, ...args) => handler(...args))
    }
}
