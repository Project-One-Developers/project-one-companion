import { WowClassName, WowSpec } from '@shared/types/types'
import { WOW_CLASS_WITH_SPECS } from './spec-utils.schemas'

export const getClassSpecs = (wowClass: number | WowClassName): WowSpec[] => {
    return (
        WOW_CLASS_WITH_SPECS.find((c) =>
            typeof wowClass === 'number' ? c.id === wowClass : c.name === wowClass
        )?.specs ?? []
    )
}
