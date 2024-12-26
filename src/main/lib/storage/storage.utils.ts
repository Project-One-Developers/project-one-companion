import { isPresent } from '../utils'

// export const parseAndValidate = <Schema extends ZodTypeAny>(
//     schema: Schema,
//     rawData: unknown
// ): z.infer<Schema> | null => {
//     if (rawData === null || rawData === undefined) {
//         return null
//     }

//     const parsedResult = schema.safeParse(rawData)

//     if (!parsedResult.success) {
//         console.log(`Failed to parse data: ${parsedResult.error.errors}`)
//         return null
//     }

//     return parsedResult.data
// }

export const takeFirstResult = <T>(results: T[]): T | null =>
    results.length > 0 && isPresent(results[0]) ? results[0] : null
