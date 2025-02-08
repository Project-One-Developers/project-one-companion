import { SPEC_ID_TO_CLASS_SPEC } from './spec-parser.schemas'

export const getClassSpec = (specId: number) => {
    const mapping = SPEC_ID_TO_CLASS_SPEC[specId]
    if (!mapping) {
        throw new Error(`Invalid spec ID: ${specId}`)
    }
    return mapping
}
