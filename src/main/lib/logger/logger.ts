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

export const createLogger = (): Logger => createWinstonLogger(import.meta.env.DEV)

export const logger = createLogger()
