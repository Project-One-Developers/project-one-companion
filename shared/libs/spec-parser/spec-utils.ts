import { Item, WowClass, WowClassName, WoWRole, WowSpec } from '@shared/types/types'
import { WOW_CLASS_WITH_SPECS } from './spec-utils.schemas'

export const getClassSpecs = (wowClass: number | WowClassName): WowSpec[] => {
    return (
        WOW_CLASS_WITH_SPECS.find(c =>
            typeof wowClass === 'number' ? c.id === wowClass : c.name === wowClass
        )?.specs ?? []
    )
}

export const getWowClassByName = (wowClassName: WowClassName): WowClass => {
    return WOW_CLASS_WITH_SPECS.find(c => c.name === wowClassName)!
}

export const getClassSpecsForRole = (wowClass: number | WowClassName, role: WoWRole): WowSpec[] => {
    return WOW_CLASS_WITH_SPECS.filter(c =>
        typeof wowClass === 'number' ? c.id === wowClass : c.name === wowClass
    )
        .flatMap(c => c.specs)
        .filter(spec => spec.role === role)
}

export const getSpec = (id: number): WowSpec => {
    const res = WOW_CLASS_WITH_SPECS.flatMap(c => c.specs).find(s => s.id === id)
    if (!res) throw Error('getSpec(): spec ' + id + 'not mapped')
    return res
}

export const getWowClassBySpecId = (id: number): WowClass => {
    const res = WOW_CLASS_WITH_SPECS.find(s => s.specs.some(s => s.id === id))
    if (!res) throw Error('getWowClassBySpecId(): spec ' + id + 'not mapped')
    return res
}

const tankSpecIds = [66, 73, 104, 250, 268, 581]
const healerSpecIds = [65, 105, 256, 257, 264, 270, 1468]

export const isTankSpec = (id: number): boolean => {
    return tankSpecIds.includes(id)
}
export const isHealerSpec = (id: number): boolean => {
    return healerSpecIds.includes(id)
}

export const isTankItem = (item: Item): boolean => {
    return (
        item.specIds != null &&
        item.specIds.length === tankSpecIds.length &&
        item.specIds.every(id => isTankSpec(id))
    )
}

export const isHealerItem = (item: Item): boolean => {
    return (
        item.specIds != null &&
        item.specIds.length === healerSpecIds.length &&
        item.specIds.every(id => isHealerSpec(id))
    )
}
