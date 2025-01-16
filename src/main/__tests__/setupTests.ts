import { jest } from '@jest/globals'

// Create a mock for the db

// Mock the entire module
jest.mock('../lib/storage/storage.config', () => ({
    __esModule: true,
    db: jest.fn()
}))

// mock modules that access electron-store
jest.mock('electron-store', () => ({
    __esModule: true,
    default: jest.fn()
}))

// mock access to electron-store during test
jest.mock('electron-store', () => {
    return jest.fn().mockImplementation(() => ({
        has: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
        clear: jest.fn()
    }))
})
