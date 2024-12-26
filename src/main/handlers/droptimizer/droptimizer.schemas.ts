import { z } from 'zod'

export const csvDataSchema = z.string().transform((data) => {
    // Remove first and last row (header and empty row)
    const rows = data
        .split('\n')
        .slice(1, -1)
        .map((row) => {
            // Taking only the first two columns
            const [nameOrId, dmg] = row.split(',')
            return { nameOrId, dmg }
        })
    const [firstRow, ...itemRows] = rows

    const characterName = firstRow.nameOrId
    const baseDmg = Number(firstRow.dmg)

    const upgrades = itemRows
        .map((row) => ({
            dps: Math.round(Number(row.dmg) - baseDmg),
            itemId: Number(row.nameOrId.split('/')[3]) // Item ID is the fourth element
        }))
        .filter((item) => item.dps > 0)

    return { characterName, baseDmg, upgrades }
})

export const jsonDataSchema = z
    .object({
        sim: z.object({
            options: z.object({
                fight_style: z.string(),
                desired_targets: z.number(),
                max_time: z.number()
            })
        }),
        simbot: z.object({
            title: z.string(),
            simType: z.literal('droptimizer') // At the moment, we only support droptimizer sims
        }),
        timestamp: z.number()
    })
    .transform((data) => {
        return {
            fightStyle: data.sim.options.fight_style,
            targets: data.sim.options.desired_targets,
            duration: data.sim.options.max_time,
            difficulty: data.simbot.title.split('•')[2].replaceAll(' ', ''), // Difficulty is the third element
            date: data.timestamp
        }
    })
