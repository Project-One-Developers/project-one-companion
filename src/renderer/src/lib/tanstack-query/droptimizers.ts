import type { Droptimizer, WowRaidDifficulty } from 'shared/types/types'

export const fetchDroptimizers = async (): Promise<{ droptimizers: Droptimizer[] }> => {
    const droptimizers = await window.api.getDroptimizerList()
    return { droptimizers }
}

export const fetchLatestDroptimizers = async (): Promise<{ droptimizers: Droptimizer[] }> => {
    const droptimizers = await window.api.getDroptimizerLatestList()
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

export const getDroptimizerLastByCharAndDiff = async (
    charName: string,
    charRealm: string,
    diff: WowRaidDifficulty
): Promise<Droptimizer | null> => {
    return await window.api.getDroptimizerLastByCharAndDiff(charName, charRealm, diff)
}
