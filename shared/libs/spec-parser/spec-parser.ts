import { WowClass, WowSpec } from '@shared/types/types'
import { SPEC_ID_TO_CLASS_SPEC } from './spec-parser.schemas'

export const getClassSpec = (specId: number): { wowClass: WowClass; wowSpec: WowSpec } => {
    const mapping = SPEC_ID_TO_CLASS_SPEC[specId]
    if (!mapping) {
        throw new Error(`Invalid spec ID: ${specId}`)
    }
    return mapping
}
