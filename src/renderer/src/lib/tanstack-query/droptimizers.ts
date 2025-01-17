import type { Droptimizer } from 'shared/types/types'

export const fetchDroptimizers = async (): Promise<{ droptimizers: Droptimizer[] } | null> => {
    const droptimizers = await window.api.getDroptimizerList()
    return { droptimizers }
}

export const addDroptimizer = async (url: string): Promise<Droptimizer> => {
    return await window.api.addDroptimizer(url)
}

export const deleteDroptimizer = async (url: string): Promise<void> => {
    return await window.api.deleteDroptimizer(url)
}

export const syncDroptimizersFromDiscord = async (): Promise<void> => {
    return await window.api.syncDroptimizerFromDiscord()
}
