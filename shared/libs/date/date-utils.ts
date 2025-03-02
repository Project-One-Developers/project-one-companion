import { match } from 'ts-pattern'

/**
 * Formats a Unix timestamp to a relative day string.
 *
 * @param unixTimestamp - The Unix timestamp to format.
 * @returns A string representing the relative day (e.g., "Today", "Yesterday", "X days ago").
 */
export function formatUnixTimestampToRelativeDays(unixTimestamp: number): string {
    const diffDays = unixTimestampToRelativeDays(unixTimestamp)

    return match(diffDays)
        .with(0, () => 'Today')
        .with(1, () => 'Yesterday')
        .otherwise((days) => `${days} days ago`)
}

/**
 * Converts a Unix timestamp to the number of days relative to the current date.
 *
 * @param unixTimestamp - The Unix timestamp to convert.
 * @returns The number of days between the given timestamp and the current date.
 */
export function unixTimestampToRelativeDays(unixTimestamp: number): number {
    const now = new Date()
    const date = new Date(unixTimestamp * 1000)
    const diffTime = now.getTime() - date.getTime()
    return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Gets the current World of Warcraft week number.
 *
 * @returns The current WoW week number.
 */
export function currentWowWeek(): number {
    return unixTimestampToWowWeek(Math.floor(Date.now() / 1000)) // current unix timestamp
}

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

/**
 * Converts a Unix timestamp to the World of Warcraft week number.
 *
 * @param unixTimestamp - The Unix timestamp to convert.
 * @returns The WoW week number corresponding to the given timestamp.
 */
export function unixTimestampToWowWeek(unixTimestamp: number): number {
    const startTimestamp = 1101254400 // WoW launch date (Wednesday) Unix timestamp

    // Days difference adjusted for the WoW week starting on Wednesday
    const daysDifference = Math.floor((unixTimestamp - startTimestamp) / 86400)

    // Calculate the week number
    return Math.floor(daysDifference / 7)
}

/**
 * Formats a Unix timestamp to an Italian date string.
 *
 * @param unixTimestamp - The Unix timestamp to format.
 * @returns A string representing the date in Italian format (e.g., "lunedì, 1 gennaio, 12:00").
 */
export function formaUnixTimestampToItalianDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000)
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
    return new Intl.DateTimeFormat('it-IT', options).format(date)
}

/**
 * Formats the World of Warcraft week number to a date range string.
 *
 * @param wowWeek - The WoW week number to format (optional).
 * @returns A string representing the date range of the given WoW week (e.g., "24/11/2004 - 30/11/2004").
 */
export function formatWowWeek(wowWeek?: number): string {
    if (wowWeek == null) {
        wowWeek = currentWowWeek()
    }

    const WOW_START_DATE = new Date('2004-11-24T00:00:00Z') // WoW start date (Wednesday)

    // Calculate the start date of the given WoW week
    const weekStartDate = new Date(WOW_START_DATE.getTime() + wowWeek * 7 * 86400000)

    // Calculate the end date (Tuesday of the same week)
    const weekEndDate = new Date(weekStartDate.getTime() + 6 * 86400000)

    // Format the date range to DD/MM/YYYY
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }
    const startDateString = weekStartDate.toLocaleDateString('it-IT', options)
    const endDateString = weekEndDate.toLocaleDateString('it-IT', options)

    return `${startDateString} - ${endDateString}`
}

/**
 * Formats a Unix timestamp for display in DD/MM/YYYY HH:MM format.
 *
 * @param unixTimestamp - The Unix timestamp to format.
 * @returns A string representing the formatted date and time.
 */
export const formatUnixTimestampForDisplay = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

/**
 * Parses a date string in the format "DD/MM/YYYY HH:MM" to a Unix timestamp.
 *
 * @param dateString - The date string to parse.
 * @returns The Unix timestamp corresponding to the given date string.
 */
export const parseStringToUnixTimestamp = (dateString: string): number => {
    const [datePart, timePart] = dateString.split(' ')
    const [day, month, year] = datePart.split('/').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    const date = new Date(year, month - 1, day, hours, minutes)
    return Math.floor(date.getTime() / 1000)
}

/**
 * Checks if the given Unix timestamp falls within the current World of Warcraft (WoW) week.
 *
 * @param dateUnixTs - The Unix timestamp to check.
 * @returns `true` if the timestamp is within the current WoW week, `false` otherwise.
 */
export const isInCurrentWowWeek = (dateUnixTs: number): boolean => {
    return currentWowWeek() === unixTimestampToWowWeek(dateUnixTs)
}
