import { v4 as uuid } from 'uuid'

export const isPresent = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined

export const newUUID = (): string => uuid()

/**
 * Returns the current Unix timestamp in seconds.
 */
export const getUnixTimestamp = (): number => Math.floor(Date.now() / 1000)

/**
 * Converts an ISO 8601 datetime string to a Unix timestamp in seconds.
 *
 * @param isoDateTime - The ISO 8601 datetime string to convert.
 * @returns The Unix timestamp in seconds.
 */
export const isoToUnixTimestamp = (isoDateTime: string): number =>
    Math.floor(new Date(isoDateTime).getTime() / 1000)
