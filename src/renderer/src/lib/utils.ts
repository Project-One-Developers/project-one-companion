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

export function unitTimestampToRelativeDays(unixTimestamp: number): string {
    const daysAgo = Math.floor((Date.now() - unixTimestamp * 1000) / 86400000)
    return daysAgo ? `${daysAgo} days ago` : 'Today'
}
