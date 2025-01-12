import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CLASSES } from '../../../../shared/consts/wow.consts'
import type { WowClass } from '../../../../shared/types/types'

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

export function getClassColor(className: WowClass): string {
    const classColor = CLASSES.find((classItem) => classItem === className)
    if (classColor) {
        return 'bg-' + classColor.replace(' ', '').toLowerCase()
    }
    return 'bg-deathknight'
}

export function getDpsHumanReadable(dps: number): string {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format(dps)
}

export function formatUnixTimestampToRelativeDays(unixTimestamp: number): string {
    const diffDays = unixTimestampToRelativeDays(unixTimestamp)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
}

export function unixTimestampToRelativeDays(unixTimestamp: number): number {
    const now = new Date()
    const date = new Date(unixTimestamp * 1000)
    const diffTime = now.getTime() - date.getTime()
    return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

export function unixTimestampToWowWeek(unixTimestamp?: number): number {
    if (unixTimestamp == null) {
        unixTimestamp = Math.floor(Date.now() / 1000) // current unix timestamp
    }

    const startTimestamp = 1101254400 // WoW launch date (Wednesday) Unix timestamp

    // Days difference adjusted for the WoW week starting on Wednesday
    const daysDifference = Math.floor((unixTimestamp - startTimestamp) / 86400)

    // Calculate the week number
    return Math.floor(daysDifference / 7)
}

export function formaUnixTimestampToItalianDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000)
    return date.toLocaleString('it-IT')
}

export function formatWowWeek(wowWeek?: number): string {
    if (wowWeek == null) {
        wowWeek = unixTimestampToWowWeek()
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
