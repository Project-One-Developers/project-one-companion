import { WowClass, WowRaidDifficulty } from '@shared/types/types'
import { z } from 'zod'

const extractWeeklyRewardChoices = (
    text: string
): { id: number; bonusString: string; itemLevel: number }[] => {
    const rewardSectionRegex =
        /### Weekly Reward Choices\n([\s\S]*?)\n### End of Weekly Reward Choices/
    const match = text.match(rewardSectionRegex)

    if (!match) return []

    const items: { id: number; bonusString: string; itemLevel: number }[] = []
    const itemRegex = /# .*?\((\d+)\)\n#.*?id=(\d+),bonus_id=([\d/]+)/g
    let itemMatch: string[] | null

    while ((itemMatch = itemRegex.exec(match[1])) !== null) {
        items.push({
            id: parseInt(itemMatch[2], 10),
            bonusString: itemMatch[3].replaceAll('/', ':'),
            itemLevel: parseInt(itemMatch[1], 10)
        })
    }

    return items
}

export const jsonDataSchema = z
    .object({
        sim: z.object({
            options: z.object({
                fight_style: z.string(),
                desired_targets: z.number(),
                max_time: z.number()
            }),
            players: z.array(
                z.object({
                    name: z.string(),
                    talents: z.string(),
                    collected_data: z.object({
                        dps: z.object({
                            mean: z.number()
                        })
                    })
                })
            ),
            profilesets: z.object({
                metric: z.string(),
                // upgrades
                results: z.array(
                    z.object({
                        name: z.string(),
                        mean: z.number()
                    })
                )
            })
        }),
        simbot: z.object({
            title: z.string(),
            publicTitle: z.string(),
            simType: z.literal('droptimizer'), // At the moment, we only support droptimizer sims
            input: z.string(), // original raidbot input
            meta: z.object({
                rawFormData: z.object({
                    text: z.string(),
                    character: z.object({
                        name: z.string(),
                        realm: z.string(),
                        upgradeCurrencies: z
                            .array(
                                z.object({
                                    type: z.string(),
                                    id: z.number(),
                                    amount: z.number()
                                })
                            )
                            .nullish(),
                        talentLoadouts: z.array(
                            z.object({
                                talents: z.object({
                                    className: z.string(),
                                    classId: z.number(),
                                    specName: z.string(),
                                    specId: z.number()
                                })
                            })
                        )
                    })
                })
            })
        }),
        timestamp: z.number()
    })
    .transform((data) => {
        const raidId = Number(data.sim.profilesets.results[0].name.split('/')[0])
        const dpsMean = data.sim.players[0].collected_data.dps.mean
        const upgrades = data.sim.profilesets.results.map((item) => ({
            dps: Math.round(item.mean - dpsMean),
            encounterId: Number(item.name.split('/')[1]),
            itemId: Number(item.name.split('/')[3]),
            ilvl: Number(item.name.split('/')[4]),
            slot: item.name.split('/')[6]
        }))

        return {
            simInfo: {
                date: data.timestamp,
                fightstyle: data.sim.options.fight_style,
                duration: data.sim.options.max_time,
                nTargets: data.sim.options.desired_targets,
                raidbotInput: data.simbot.meta.rawFormData.text
                    ? data.simbot.meta.rawFormData.text
                    : data.simbot.input
            },
            raidInfo: {
                id: raidId,
                difficulty: data.simbot.publicTitle
                    .split('•')[2]
                    .replaceAll(' ', '') as WowRaidDifficulty // Difficulty is the third element
            },
            charInfo: {
                name: data.simbot.meta.rawFormData.character.name,
                server: data.simbot.meta.rawFormData.character.realm
                    .toLowerCase()
                    .replaceAll('_', '-'),
                class: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents
                    .className as WowClass,
                classId: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.classId,
                spec: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.specName,
                specId: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.specId,
                talents: data.sim.players[0].talents
            },
            weeklyChest: data.simbot.meta.rawFormData.text
                ? extractWeeklyRewardChoices(data.simbot.meta.rawFormData.text)
                : [],
            currencies: data.simbot.meta.rawFormData.character.upgradeCurrencies ?? [],
            upgrades: upgrades
        }
    })
