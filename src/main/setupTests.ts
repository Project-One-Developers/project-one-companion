import { jest } from '@jest/globals'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

// Create a mock for the db
const dbMock: DeepMockProxy<typeof import('./lib/storage/storage.config').db> = mockDeep()

// Mock the entire module
jest.mock('./lib/storage/storage.config', () => ({
    __esModule: true,
    db: dbMock
}))
