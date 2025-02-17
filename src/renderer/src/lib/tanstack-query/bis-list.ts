import { BisList } from '@shared/types/types'

export const fetchBisList = async (): Promise<BisList[]> => {
    return await window.api.getBisList()
}

export const updateItemBisSpecs = async (itemId: number, specIds: number[]): Promise<void> => {
    return await window.api.updateItemBisSpecs(itemId, specIds)
}
