import type { SimC } from '@shared/types/types'
import { addSimC } from '@storage/droptimizer/simc.storage'
import { parseSimC } from './simc.utils'

export const addSimcHandler = async (simc: string): Promise<SimC> => {
    const simC: SimC = await parseSimC(simc)
    await addSimC(simC)
    return simC
}

// export const getDroptimizerListHandler = async (): Promise<Droptimizer[]> => {
//     return await getDroptimizerList()
// }

// export const getDroptimizerLatestListHandler = async (): Promise<Droptimizer[]> => {
//     return await getDroptimizerLatestList()
// }
