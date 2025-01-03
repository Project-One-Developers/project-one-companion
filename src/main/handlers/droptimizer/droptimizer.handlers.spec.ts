import { describe, expect, it, jest } from '@jest/globals'
import { addDroptimizer } from '@storage/droptimizer/droptimizer.storage'
import * as fs from 'fs'
import { allHandlers } from '..'
import { addDroptimizerHandler } from './droptimizer.handlers'

jest.mock('./droptimizer.utils', () => {
    const originalModule = jest.requireActual('./droptimizer.utils')
    const fetchRaidbotsDataMock = jest.fn((url: string) => {
        console.log(`Mocking return value for ${url}`)
        const mockCsvData = fs.readFileSync('resources/raidbots/testData/data.csv', 'utf8')
        const mockJsonData = JSON.parse(
            fs.readFileSync('resources/raidbots/testData/data.json', 'utf8')
        )
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

jest.mock('@storage/droptimizer/droptimizer.storage', () => ({
    __esModule: true,
    addDroptimizer: jest.fn()
}))

describe('Droptimizer Handlers', () => {
    it('should have the add-droptimizer handler', () => {
        expect(allHandlers['add-droptimizer']).toBeDefined()
        expect(allHandlers['add-droptimizer']).toEqual(addDroptimizerHandler)
        expect(typeof allHandlers['add-droptimizer']).toBe('function')
    })

    it('should throw an error when URL is not provided', async () => {
        await expect(addDroptimizerHandler('')).rejects.toThrow() // non mi interessa validare l'errore specifico
    })

    it('should call addDroptimizerHandler with correct arguments and insert into database', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx'

        await addDroptimizerHandler(testUrl)

        const expectedData = {
            characterName: 'Bubbledan',
            date: 1734552471,
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
                    encounterId: 2601,
                    itemId: 221023,
                    slot: 'trinket2'
                },
                {
                    dps: 4794,
                    encounterId: 2612,
                    itemId: 220305,
                    slot: 'trinket1'
                },
                {
                    dps: 490,
                    encounterId: 2609,
                    itemId: 212062,
                    slot: 'waist'
                },
                {
                    dps: 25,
                    encounterId: 2611,
                    itemId: 212061,
                    slot: 'wrist'
                },
                {
                    dps: 14306,
                    encounterId: 2602,
                    itemId: 225578,
                    slot: 'finger2'
                }
            ],
            url: 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx'
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })
})
