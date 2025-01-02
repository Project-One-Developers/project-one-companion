import { Item } from '@shared/types/types'
import { getItems } from '@storage/items/items.storage'

export const getItemsHandler = async (): Promise<Item[]> => {
    return await getItems()
}
