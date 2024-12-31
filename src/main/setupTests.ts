import { jest } from '@jest/globals'
import fs from 'fs'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import path from 'path'
import { logger } from './lib/logger/logger'

// Create a mock for the db
const dbMock: DeepMockProxy<typeof import('./lib/storage/storage.config').db> = mockDeep()
const fetchRaidbotsDataMock = jest.fn((url: string) => {
    logger.info(`Mocking return value for ${url}`)
    const mockCsvData = fs.readFileSync(
        path.resolve(__dirname, '../../resources/raidbots/testData/data.csv'),
        'utf8'
    )
    const mockJsonData = JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname, '../../resources/raidbots/testData/data.json'),
            'utf8'
        )
    )
    return Promise.resolve({
        csvData: mockCsvData,
        jsonData: mockJsonData
    })
})

// Mock the entire module
jest.mock('./lib/storage/storage.config', () => ({
    __esModule: true,
    db: dbMock
}))

// Mock the fetchRaidbotsData function
jest.mock('./handlers/droptimizer/droptimizer.utils', () => ({
    __esModule: true,
    fetchRaidbotsData: fetchRaidbotsDataMock
}))

// beforeEach(() => {
//     mockReset(dbMock)
//     mockReset(fetchRaidbotsDataMock)
// })
