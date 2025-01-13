import { z } from 'zod'

export const setZodErrorMap = () => {
    z.setErrorMap((issue, ctx) => {
        const baseError = z.defaultErrorMap(issue, ctx)
        const path = issue.path.length > 0 ? ` at: ${issue.path.join('.')}` : ''

        return {
            ...baseError,
            message: `${baseError.message}${path}`
        }
    })
}
