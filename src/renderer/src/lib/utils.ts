import { CLASSES_NAME } from '@shared/consts/wow.consts'
import { WowClassName } from '@shared/types/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

export function getClassColor(className: WowClassName): string {
    const classColor = CLASSES_NAME.find((classItem) => classItem === className)
    if (classColor) {
        return 'bg-' + classColor.replace(' ', '').toLowerCase()
    }
    return 'bg-deathknight'
}

export function getDpsHumanReadable(dps: number): string {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format(dps)
}
