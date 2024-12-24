/* eslint-disable @typescript-eslint/no-explicit-any */

// TODO: make generic
import { ipcMain } from 'electron'

type HandlerFunction = (...args: any[]) => Promise<any>

export type Handlers = Record<string, HandlerFunction>

export const registerHandlers = (handlers: Record<string, HandlerFunction>): void => {
    for (const [channel, handler] of Object.entries(handlers)) {
        ipcMain.handle(channel, async (event, ...args) => handler(...args))
    }
}
