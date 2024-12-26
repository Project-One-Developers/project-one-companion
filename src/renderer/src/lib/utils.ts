import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CLASSES } from '../../../../shared/consts/wow.consts'
import { WowClass } from '../../../../shared/types/types'

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
