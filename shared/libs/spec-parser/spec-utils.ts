import { Item, WowClass, WowClassName, WoWRole, WowSpec, WowSpecName } from '@shared/types/types'
import { WOW_CLASS_WITH_SPECS } from './spec-utils.schemas'

const tankSpecIds = [66, 73, 104, 250, 268, 581]
const healerSpecIds = [65, 105, 256, 257, 264, 270, 1468]

export const getWowClassFromIdOrName = (wowClass: number | WowClassName): WowClass => {
    const matchingClass = WOW_CLASS_WITH_SPECS.find(c =>
        typeof wowClass === 'number' ? c.id === wowClass : c.name === wowClass
    )

    if (!matchingClass) {
        throw new Error(`No wow class found for ${wowClass}`)
    }

    return matchingClass
}

/**
 * Get spec ID from class name and spec name
 * @param className - The class name (e.g., 'Warrior', 'Paladin', etc.)
 * @param specName - The spec name (e.g., 'Arms', 'Holy', etc.)
 * @returns The spec ID or null if not found
 */
export const getWowSpecByClassNameAndSpecName = (className: WowClassName, specName: WowSpecName): WowSpec | null => {
    const wowClass = WOW_CLASS_WITH_SPECS.find(
        cls => cls.name.toLowerCase() === className.toLowerCase()
    )

    if (!wowClass) return null

    const spec = wowClass.specs.find(
        spec => spec.name.toLowerCase() === specName.toLowerCase()
    )

    return spec ? spec : null
}


export const getClassSpecs = (wowClass: number | WowClassName): WowSpec[] => {
    return getWowClassFromIdOrName(wowClass).specs
}

export const getClassSpecsForRole = (wowClass: number | WowClassName, role: WoWRole): WowSpec[] => {
    const matchingClass = getWowClassFromIdOrName(wowClass)

    return matchingClass.specs.filter(spec => spec.role === role)
}

export const getSpecById = (id: number): WowSpec => {
    const res = WOW_CLASS_WITH_SPECS.flatMap(c => c.specs).find(s => s.id === id)
    if (!res) throw Error('getSpec(): spec ' + id + 'not mapped')
    return res
}

export const getWowClassBySpecId = (id: number): WowClass => {
    const res = WOW_CLASS_WITH_SPECS.find(s => s.specs.some(s => s.id === id))
    if (!res) throw Error('getWowClassBySpecId(): spec ' + id + 'not mapped')
    return res
}

export const isTankSpec = (id: number): boolean => {
    return tankSpecIds.includes(id)
}
export const isHealerSpec = (id: number): boolean => {
    return healerSpecIds.includes(id)
}

export const isTankItem = (item: Item): boolean => {
    return isTankSpecs(item.specIds)
}

export const isHealerItem = (item: Item): boolean => {
    return isHealerSpecs(item.specIds)
}

export const isHealerSpecs = (specIds: number[] | null): boolean => {
    return (
        specIds != null &&
        specIds.length === healerSpecIds.length &&
        specIds.every(id => isHealerSpec(id))
    )
}

export const isTankSpecs = (specIds: number[] | null): boolean => {
    return (
        specIds != null &&
        specIds.length === tankSpecIds.length &&
        specIds.every(id => isTankSpec(id))
    )
}
