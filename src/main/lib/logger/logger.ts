/* eslint-disable @typescript-eslint/no-explicit-any */

import isDev from 'electron-is-dev'
import { createWinstonLogger } from './winston/winston'

export interface LogFunction {
    <T extends object>(obj: T, msg?: string, ...args: any[]): void
    (obj: unknown, msg?: string, ...args: any[]): void
    (msg: string, ...args: any[]): void
}

export interface Logger {
    level: string

    fatal: LogFunction
    error: LogFunction
    warn: LogFunction
    info: LogFunction
    debug: LogFunction
    trace: LogFunction
    silent: LogFunction

    child(): Logger
}

export const createLogger = (): Logger => createWinstonLogger(isDev)

export const logger = createLogger()
