import { describe, expect, it } from '@jest/globals'
import { db } from '@storage/storage.config'
import { allHandlers } from '..'
import { addDroptimizerHandler } from './droptimizer.handlers'

describe('Droptimizer Handlers', () => {
    it('should have the add-droptimizer handler', () => {
        expect(allHandlers['add-droptimizer']).toBeDefined()
        expect(allHandlers['add-droptimizer']).toEqual(addDroptimizerHandler)
        expect(typeof allHandlers['add-droptimizer']).toBe('function')
    })

    it('should throw an error when URL is not provided', async () => {
        await expect(allHandlers['add-droptimizer']('')).rejects.toThrow() // non mi interessa validare l'errore specifico
        expect(db.insert).not.toHaveBeenCalled()
    })

    it('should call addDroptimizerHandler with correct arguments and insert into database', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx'

        // Mock the insert function to return our mock result
        //db.insert.mockResolvedValue([mockInsertResult])

        const result = await addDroptimizerHandler(testUrl)

        expect(db.transaction).toHaveBeenCalledTimes(1)
        expect(result).toEqual({})
    })
})
