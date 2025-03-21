import { BossWithItems, LootWithAssigned } from '@shared/types/types'

export const generateLootFilename = (
    sessions: { id: string; name: string }[],
    selectedSessionIds: Set<string>,
    suffix: string
) => {
    return (
        sessions
            .filter((session) => selectedSessionIds.has(session.id))
            .map((session) => session.name)
            .join('-') + `-${suffix}.csv`
    )
}

export const prepareLootData = (loots: LootWithAssigned[], encounterList: BossWithItems[]) => {
    return loots
        .filter((loot) => loot.assignedCharacter !== null)
        .map((loot) => ({
            Difficoltà: loot.raidDifficulty ?? '',
            Boss:
                encounterList
                    .find((boss) => boss.items.find((item) => item.id === loot.gearItem.item.id))
                    ?.name.replaceAll(',', ' ') ?? '',
            Item: loot.gearItem.item.name ?? '',
            Livello: loot.gearItem.itemLevel ?? '',
            Slot:
                loot.gearItem.item.slotKey
                    .replaceAll('_', ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase()) ?? '',
            Character: loot.assignedCharacter?.name ?? ''
        }))
        .sort((a, b) => {
            if (a.Character < b.Character) return -1
            if (a.Character > b.Character) return 1
            if (a.Difficoltà < b.Difficoltà) return -1
            if (a.Difficoltà > b.Difficoltà) return 1
            return 0
        })
}

export const prepareStatsData = (loots: LootWithAssigned[], encounterList: BossWithItems[]) => {
    // Group loots by Boss and Difficulty
    const groupedData: Record<
        string,
        { RaidDpsGain: number; TwoPiecesClosed: string[]; FourPiecesClosed: string[] }
    > = {}

    loots.forEach((loot) => {
        if (!loot.assignedCharacter) return

        const bossName =
            encounterList
                .find((boss) => boss.items.find((item) => item.id === loot.gearItem.item.id))
                ?.name.replaceAll(',', ' ') ?? 'Unknown Boss'

        const difficulty = loot.raidDifficulty ?? 'Unknown Difficulty'

        const key = `${bossName}#${difficulty}`

        if (!groupedData[key]) {
            groupedData[key] = { RaidDpsGain: 0, TwoPiecesClosed: [], FourPiecesClosed: [] }
        }

        // Aggregate RaidDpsGain
        groupedData[key].RaidDpsGain += loot.assignedHighlights?.dpsGain ?? 0

        // Concatenate names for TwoPiecesClosed
        if (loot.assignedHighlights?.lootEnableTiersetBonus === '2p') {
            groupedData[key].TwoPiecesClosed.push(loot.assignedCharacter.name)
        }
        // Concatenate names for FourPiecesClosed
        if (loot.assignedHighlights?.lootEnableTiersetBonus === '4p') {
            groupedData[key].FourPiecesClosed.push(loot.assignedCharacter.name)
        }
    })

    // Transform grouped data into the desired format
    return Object.entries(groupedData).map(([key, value]) => {
        const [Boss, Difficoltà] = key.split('#')
        return {
            Boss,
            Difficoltà,
            RaidDpsGain: value.RaidDpsGain,
            TwoPiecesClosed: value.TwoPiecesClosed.join('|'),
            FourPiecesClosed: value.FourPiecesClosed.join('|')
        }
    })
}
