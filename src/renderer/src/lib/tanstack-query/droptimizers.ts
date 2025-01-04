import type { Droptimizer } from 'shared/types/types'

export const fetchDroptimizers = async (): Promise<{ droptimizers: Droptimizer[] } | null> => {
    const droptimizers = await window.api.getDroptimizerList()
    return { droptimizers }
}

export const addDroptimizer = async (url: string): Promise<Droptimizer> => {
    return await window.api.addDroptimizer(url)
}
