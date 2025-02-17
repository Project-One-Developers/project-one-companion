import { BisList } from '@shared/types/types'
import { getBisList, updateItemBisSpec } from '@storage/bis-list/bis-list.storage'

export const getBisListHandler = async (): Promise<BisList[]> => {
    return await getBisList()
}

export const updateItemBisSpecHandler = async (
    itemId: number,
    specIds: number[]
): Promise<void> => {
    await updateItemBisSpec(itemId, specIds)
}
