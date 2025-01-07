import { describe, expect, it, jest } from '@jest/globals'
import { ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { addDroptimizer } from '@storage/droptimizer/droptimizer.storage'
import * as fs from 'fs'
import { allHandlers } from '..'
import { addDroptimizerHandler } from './droptimizer.handlers'

jest.mock('./droptimizer.utils', () => {
    const originalModule = jest.requireActual('./droptimizer.utils')
    const fetchRaidbotsDataMock = jest.fn((url: string) => {
        console.log(`Mocking return value for ${url}`)
        let mockJsonData = {}
        // Bubbledan (dh)
        if (url === 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx') {
            mockJsonData = JSON.parse(
                fs.readFileSync('resources/raidbots/testData/bubble-data.json', 'utf8')
            )
        }
        // Shant (hunter)
        else if (url === 'https://www.raidbots.com/simbot/report/2pjCMq6FWPFiVoKajjyiuw') {
            mockJsonData = JSON.parse(
                fs.readFileSync('resources/raidbots/testData/shant-data.json', 'utf8')
            )
        }
        return Promise.resolve(mockJsonData)
    })
    return {
        __esModule: true,
        ...(originalModule as object), // keep other function from the original module
        fetchRaidbotsData: fetchRaidbotsDataMock
    }
})

jest.mock('@storage/droptimizer/droptimizer.storage', () => {
    const originalModule = jest.requireActual('./droptimizer.utils')
    const getItemToTiersetMappingMock = jest.fn((): Promise<ItemToTierset[]> => {
        const tiersetMapping = JSON.parse(
            fs.readFileSync('resources/wow/items_to_tierset.json', 'utf8')
        )
        return Promise.resolve(tiersetMapping)
    })
    const getItemToCatalystMappingMock = jest.fn((): Promise<ItemToCatalyst[]> => {
        const catalystMapping = JSON.parse(
            fs.readFileSync('resources/wow/items_to_catalyst.json', 'utf8')
        )
        return Promise.resolve(catalystMapping)
    })
    return {
        __esModule: true,
        ...(originalModule as object), // keep other function from the original module
        addDroptimizer: jest.fn(),
        getItemToTiersetMapping: getItemToTiersetMappingMock,
        getItemToCatalystMapping: getItemToCatalystMappingMock
    }
})

describe('Droptimizer Handlers', () => {
    it('should have the add-droptimizer handler', () => {
        expect(allHandlers['add-droptimizer']).toBeDefined()
        expect(allHandlers['add-droptimizer']).toEqual(addDroptimizerHandler)
        expect(typeof allHandlers['add-droptimizer']).toBe('function')
    })

    it('should throw an error when URL is not provided', async () => {
        await expect(addDroptimizerHandler('')).rejects.toThrow() // non mi interessa validare l'errore specifico
    })

    it('should call addDroptimizerHandler with correct upgrades bubble (no tierset, catalyst)', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx'

        await addDroptimizerHandler(testUrl)

        const expectedData = {
            ak: '1273,Mythic,Bubbledan,pozzo_delleternità,Havoc,Demon Hunter',
            url: testUrl,
            charInfo: {
                name: 'Bubbledan',
                server: 'pozzo_delleternità',
                class: 'Demon Hunter',
                classId: 12,
                spec: 'Havoc',
                specId: 577,
                talents:
                    'CEkAEDLOxe3SEPP2R8Hw6bhoSYGMzMzgZmZMmJmZGAAAAAAwsMmxMMGLzMz2sNLjZGmZBLbwysYGDzmmGMzMzgN'
            },
            raidInfo: {
                id: 1273,
                difficulty: 'Mythic'
            },
            simInfo: {
                date: 1734552471,
                fightstyle: 'Patchwerk',
                duration: 300,
                nTargets: 1,
                raidbotInput:
                    'demonhunter="Bubbledan"\nlevel=80\nrace=blood_elf\nregion=eu\nserver=pozzo_delleternità\nrole=attack\nprofessions=alchemy=100/enchanting=105\nspec=havoc\ntalents=CEkAEDLOxe3SEPP2R8Hw6bhoSYGMzMzgZmZMmJmZGAAAAAAwsMmxMMGLzMz2sNLjZGmZBLbwysYGDzmmGMzMzgN\nhead=,id=212065,gem_id=213491,bonus_id=6652/10356/8095/10371/10299/1540/10255/10397\nneck=,id=215136,gem_id=213467/213491,bonus_id=10421/9633/8902/10394/10879/9627/10222/8791/11144,crafted_stats=40/32,crafting_quality=5\nshoulder=,id=212063,bonus_id=10356/10369/6652/10299/1540/10255\nback=,id=212446,enchant_id=7403,bonus_id=10380/10356/10299/1540/10255\nchest=,id=212068,enchant_id=7364,bonus_id=40/10390/10373/10299/1540/10255\ntabard=,id=69210\nwrist=,id=212438,enchant_id=7385,gem_id=213458,bonus_id=6652/10380/10356/10299/1540/10255/10397\nhands=,id=219333,bonus_id=10421/9633/8902/9627/11144/11109/8960/8791/10222,crafted_stats=40/36,crafting_quality=5\nwaist=,id=225583,gem_id=213491,bonus_id=6652/10397/10380/10356/10299/1540/10255\nlegs=,id=212064,enchant_id=7601,bonus_id=6652/10356/8095/10370/10299/1540/10255\nfeet=,id=212445,enchant_id=7424,bonus_id=6652/10380/10356/10299/1540/10255\nfinger1=,id=133286,enchant_id=7340,gem_id=213482/213491,bonus_id=10390/6652/10383/10395/10879/10299/11342/10255\nfinger2=,id=225578,enchant_id=7346,gem_id=213743/213458,bonus_id=6652/10355/10256/1527/10255/10395/10879\ntrinket1=,id=212456,bonus_id=6652/10356/10299/1540/10255\ntrinket2=,id=212454,bonus_id=6652/10356/10299/1540/10255\nmain_hand=,id=219877,enchant_id=7463,bonus_id=40/10356/10299/1540/10255\noff_hand=,id=222440,enchant_id=7463,bonus_id=10421/9633/8902/9627/8791/10222/11144/11300/8960,crafted_stats=40/36,crafting_quality=5\nname=Bubbledan\ntemporary_enchant=\nthewarwithin.dawn_dusk_thread_lining_uptime=0.6\niterations=100000\ndesired_targets=1\nmax_time=300\ncalculate_scale_factors=0\nscale_only=strength,intellect,agility,crit,mastery,vers,haste,weapon_dps,weapon_offhand_dps\noverride.bloodlust=1\noverride.arcane_intellect=1\noverride.power_word_fortitude=1\noverride.battle_shout=1\noverride.mystic_touch=1\noverride.chaos_brand=1\noverride.skyfury=1\noverride.mark_of_the_wild=1\noverride.hunters_mark=1\noverride.bleeding=1\nreport_details=1\nsingle_actor_batch=1\noptimize_expressions=1\nprofileset."1273/2607/raid-mythic/212425/639/0/waist//"+=waist=,id=212425,bonus_id=4800/4786/523/1540/10299,gem_id=213491\nprofileset."1273/2607/raid-mythic/212062/639/0/waist//"+=waist=,id=212062,bonus_id=4800/4786/523/1540/10299,gem_id=213491\nprofileset."1273/2609/raid-mythic/212062/639/0/waist//"+=waist=,id=212062,bonus_id=4800/4786/523/1540/10299,gem_id=213491\nprofileset."1273/-67/raid-mythic/225723/639/0/waist//"+=waist=,id=225723,bonus_id=4800/4786/523/1540/10299,gem_id=213491\nprofileset."1273/-67/raid-mythic/212062/639/0/waist//"+=waist=,id=212062,bonus_id=4800/4786/523/1540/10299,gem_id=213491\nprofileset."1273/2599/raid-mythic/212067/639/7424/feet//"+=feet=,id=212067,enchant_id=7424,bonus_id=4800/4786/1540/10299\nprofileset."1273/2601/raid-mythic/225591/639/7424/feet//"+=feet=,id=225591,enchant_id=7424,bonus_id=4800/4786/1540/10299\ntarget_error=0.05'
            },
            dateImported: expect.any(Number),
            upgrades: [
                {
                    dps: 10565,
                    catalyzedItemId: null,
                    itemId: 221023,
                    slot: 'trinket2'
                },
                {
                    dps: 4794,
                    catalyzedItemId: null,
                    itemId: 220305,
                    slot: 'trinket1'
                },
                {
                    dps: 490,
                    catalyzedItemId: 212062,
                    itemId: 225583,
                    slot: 'waist'
                },
                {
                    dps: 424,
                    catalyzedItemId: 212062,
                    itemId: 225723,
                    slot: 'waist'
                },
                {
                    dps: 267,
                    catalyzedItemId: 212062,
                    itemId: 212425,
                    slot: 'waist'
                },
                {
                    dps: 25,
                    catalyzedItemId: 212061,
                    itemId: 212438,
                    slot: 'wrist'
                },
                {
                    dps: 14306,
                    catalyzedItemId: null,
                    itemId: 225578,
                    slot: 'finger2'
                }
            ]
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })

    it('should call addDroptimizerHandler with correct upgrades shant (tierset, catalyst)', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/2pjCMq6FWPFiVoKajjyiuw'

        await addDroptimizerHandler(testUrl)

        const expectedData = {
            ak: '1273,Mythic,Shant,nemesis,Beast Mastery,Hunter',
            url: testUrl,
            charInfo: {
                name: 'Shant',
                server: 'nemesis',
                class: 'Hunter',
                classId: 3,
                spec: 'Beast Mastery',
                specId: 253,
                talents:
                    'C0PAjWdaYGhrXhCioy+K0kCnACMmxGDZB2GN0wGAAAAAAGAAAAAAgZmtZMmZMYmxwMmZYGzMzMTmhxMzMzMmZYYMMzAzwsMzwC'
            },
            raidInfo: {
                id: 1273,
                difficulty: 'Mythic'
            },
            simInfo: {
                date: 1736178842,
                fightstyle: 'Patchwerk',
                duration: 300,
                nTargets: 1,
                raidbotInput:
                    'armory=eu,nemesis,Shant\nname=Shant\ntemporary_enchant=\nthewarwithin.dawn_dusk_thread_lining_uptime=0.6\niterations=100000\ndesired_targets=1\nmax_time=300\ncalculate_scale_factors=0\nscale_only=strength,intellect,agility,crit,mastery,vers,haste,weapon_dps,weapon_offhand_dps\noverride.bloodlust=1\noverride.arcane_intellect=1\noverride.power_word_fortitude=1\noverride.battle_shout=1\noverride.mystic_touch=1\noverride.chaos_brand=1\noverride.skyfury=1\noverride.mark_of_the_wild=1\noverride.hunters_mark=1\noverride.bleeding=1\nreport_details=1\nsingle_actor_batch=1\noptimize_expressions=1\nprofileset."1273/2609/raid-mythic/212448/639/0/neck//"+=neck=,id=212448,bonus_id=4800/4786/1540/10299/8781,gem_id=213470/213491\nprofileset."1273/2599/raid-mythic/225577/639/0/neck//"+=neck=,id=225577,bonus_id=4800/4786/1540/10299/8781,gem_id=213470/213491\nprofileset."1273/2608/raid-mythic/212429/639/0/shoulder//"+=shoulder=,id=212429,bonus_id=4800/4786/1540/10299\nprofileset."1273/-67/raid-mythic/225724/639/0/shoulder//"+=shoulder=,id=225724,bonus_id=4800/4786/1540/10299\nprofileset."1273/2611/raid-mythic/212414/639/0/waist//"+=waist=,id=212414,bonus_id=4800/4786/1540/10299\nprofileset."1273/2611/raid-mythic/212017/639/0/waist//"+=waist=,id=212017,bonus_id=4800/4786/1540/10299\nprofileset."1273/2612/raid-mythic/225580/639/0/waist//"+=waist=,id=225580,bonus_id=4800/4786/1540/10299\nprofileset."1273/2612/raid-mythic/212017/639/0/waist//"+=waist=,id=212017,bonus_id=4800/4786/1540/10299\ntarget_error=0.05'
            },
            dateImported: expect.any(Number),
            upgrades: [
                {
                    itemId: 212400,
                    slot: 'main_hand',
                    dps: 5602,
                    catalyzedItemId: null
                },
                {
                    itemId: 225574,
                    slot: 'back',
                    dps: 7725,
                    catalyzedItemId: null
                },
                {
                    itemId: 212399,
                    slot: 'main_hand',
                    dps: 6035,
                    catalyzedItemId: null
                },
                {
                    itemId: 225578,
                    slot: 'finger2',
                    dps: 30069,
                    catalyzedItemId: null
                },
                {
                    itemId: 225576,
                    slot: 'finger2',
                    dps: 10625,
                    catalyzedItemId: null
                },
                {
                    itemId: 212431,
                    slot: 'feet',
                    dps: 5575,
                    catalyzedItemId: 212022
                },
                {
                    itemId: 212456,
                    slot: 'trinket2',
                    dps: 2372,
                    catalyzedItemId: null
                },
                {
                    itemId: 212447,
                    slot: 'finger2',
                    dps: 12692,
                    catalyzedItemId: null
                },
                {
                    itemId: 212415,
                    slot: 'wrist',
                    dps: 4847,
                    catalyzedItemId: null
                },
                {
                    itemId: 225586,
                    slot: 'feet',
                    dps: 6038,
                    catalyzedItemId: null
                },
                {
                    itemId: 212429,
                    slot: 'shoulder',
                    dps: 2804,
                    catalyzedItemId: null
                },
                {
                    itemId: 225581,
                    slot: 'wrist',
                    dps: 5977,
                    catalyzedItemId: null
                },
                {
                    itemId: 212454,
                    slot: 'trinket2',
                    dps: 12422,
                    catalyzedItemId: null
                },
                {
                    itemId: 225725,
                    slot: 'waist',
                    dps: 2617,
                    catalyzedItemId: 212017
                },
                {
                    itemId: 212414,
                    slot: 'waist',
                    dps: 2268,
                    catalyzedItemId: 212017
                },
                {
                    itemId: 220305,
                    slot: 'trinket2',
                    dps: 2794,
                    catalyzedItemId: null
                },
                {
                    itemId: 212435,
                    slot: 'legs',
                    dps: 1261,
                    catalyzedItemId: null
                },
                {
                    itemId: 225724,
                    slot: 'shoulder',
                    dps: 303,
                    catalyzedItemId: null
                },
                {
                    itemId: 225577,
                    slot: 'neck',
                    dps: 3834,
                    catalyzedItemId: null
                },
                {
                    itemId: 212448,
                    slot: 'neck',
                    dps: 10422,
                    catalyzedItemId: null
                },
                {
                    itemId: 225580,
                    slot: 'waist',
                    dps: 2309,
                    catalyzedItemId: 212017
                },
                {
                    itemId: 212446,
                    slot: 'back',
                    dps: 5867,
                    catalyzedItemId: null
                }
            ]
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })
})
