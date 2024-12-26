import { getTableColumns, sql, SQL } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { SQLiteTable } from 'drizzle-orm/sqlite-core'
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

export const buildConflictUpdateColumns = <
    T extends PgTable | SQLiteTable,
    Q extends keyof T['_']['columns']
>(
    table: T,
    columns: Q[]
): Record<Q, SQL<unknown>> => {
    const cls = getTableColumns(table)

    return columns.reduce(
        (acc, column) => {
            const colName = cls[column].name
            acc[column] = sql.raw(`excluded.${colName}`)

            return acc
        },
        {} as Record<Q, SQL>
    )
}
