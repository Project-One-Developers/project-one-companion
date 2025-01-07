import { jest } from '@jest/globals'

// Create a mock for the db

// Mock the entire module
jest.mock('../lib/storage/storage.config', () => ({
    __esModule: true,
    db: jest.fn()
}))
