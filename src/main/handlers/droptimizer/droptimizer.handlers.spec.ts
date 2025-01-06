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
        let mockCsvData = {}
        let mockJsonData = {}
        // Bubbledan (dh)
        if (url === 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx') {
            mockCsvData = fs.readFileSync('resources/raidbots/testData/bubble-data.csv', 'utf8')
            mockJsonData = JSON.parse(
                fs.readFileSync('resources/raidbots/testData/bubble-data.json', 'utf8')
            )
        }
        // Shant (hunter)
        else if (url === 'https://www.raidbots.com/simbot/report/2pjCMq6FWPFiVoKajjyiuw') {
            mockCsvData = fs.readFileSync('resources/raidbots/testData/shant-data.csv', 'utf8')
            mockJsonData = JSON.parse(
                fs.readFileSync('resources/raidbots/testData/shant-data.json', 'utf8')
            )
        }

        return Promise.resolve({
            csvData: mockCsvData,
            jsonData: mockJsonData
        })
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
            characterName: 'Bubbledan',
            date: 1734552471,
            dateImported: expect.any(Number),
            fightInfo: {
                duration: 300,
                fightstyle: 'Patchwerk',
                nTargets: 1
            },
            raidDifficulty: 'Mythic',
            resultRaw: expect.any(String),
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
            ],
            url: testUrl
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })

    it('should call addDroptimizerHandler with correct upgrades shant (tierset, catalyst)', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/2pjCMq6FWPFiVoKajjyiuw'

        await addDroptimizerHandler(testUrl)

        const expectedData = {
            characterName: 'Shant',
            date: 1736178842,
            dateImported: expect.any(Number),
            fightInfo: {
                duration: 300,
                fightstyle: 'Patchwerk',
                nTargets: 1
            },
            raidDifficulty: 'Mythic',
            resultRaw: expect.any(String),
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
            ],
            url: testUrl
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })
})
