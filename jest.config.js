/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.node.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: 'node',
    preset: 'ts-jest',
    clearMocks: true,
    transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.node.json'
            }
        ]
    },
    setupFilesAfterEnv: ['<rootDir>/src/main/__tests__/setupTests.ts'],
    testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
}
