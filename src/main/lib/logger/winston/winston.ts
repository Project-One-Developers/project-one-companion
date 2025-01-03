/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron'
import { join } from 'path'
import winston, { type LoggerOptions } from 'winston'
import type { Logger } from '../logger'
const { format, transports } = winston
const { Console } = transports
const { json } = format

const commonOptions: LoggerOptions = {
    levels: {
        ...winston.config.syslog.levels,
        fatal: 0,
        warn: 4,
        trace: 7
    },
    format: json(),
    transports: [new Console()]
}

const defaulLoggerOptions: LoggerOptions = {
    ...commonOptions,
    level: 'info'
}

const loggerOptionsByEnv = (isDev?: boolean): winston.LoggerOptions =>
    isDev ? { ...commonOptions, level: 'trace' } : defaulLoggerOptions

export const createWinstonLogger = (isDev?: boolean): Logger => {
    const createLogger = (): Logger => {
        const winstonLogger = winston.createLogger(loggerOptionsByEnv(isDev))

        const log = (level: string) =>
            function (msg: any, ...args: any[]) {
                winstonLogger.log(level, msg, ...args)
            }

        const logDirPath = isDev ? '.' : app.getPath('userData')
        winstonLogger.add(
            new winston.transports.File({
                level: 'debug',
                filename: join(logDirPath, 'app.log'),
                options: { flags: 'a' }
            })
        )
        if (isDev) winstonLogger.add(new winston.transports.Console())

        return {
            level: winstonLogger.level,
            fatal: log('fatal'),
            error: log('error'),
            warn: log('warn'),
            info: log('info'),
            debug: log('debug'),
            trace: log('trace'),
            silent: function () {
                return void 0
            },
            child: function () {
                return createLogger()
            }
        }
    }

    return createLogger()
}
