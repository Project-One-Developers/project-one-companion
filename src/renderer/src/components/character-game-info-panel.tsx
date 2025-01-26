import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getCharacterGameInfo } from '@renderer/lib/tanstack-query/players'
import { Character } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

type CharGameInfoPanelProps = {
    character: Character
}

export const CharGameInfoPanel = ({ character }: CharGameInfoPanelProps) => {
    const charGameInfoQuery = useQuery({
        queryKey: [queryKeys.characterGameInfo, character.name, character.realm],
        queryFn: () => getCharacterGameInfo(character.name, character.realm)
    })

    if (charGameInfoQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const gameInfo = charGameInfoQuery.data?.droptimizer
    const wowauditData = charGameInfoQuery.data?.wowaudit

    return (
        <div className="flex flex-col items-center relative w-full">
            {gameInfo && gameInfo.weeklyChest && (
                <WeeklyChestPanel weeklyChest={gameInfo.weeklyChest} />
            )}
            {gameInfo && gameInfo.currencies && (
                <CurrenciesPanel currencies={gameInfo.currencies} />
            )}
            {wowauditData && <WoWAuditPanel data={wowauditData} />}
        </div>
    )
}

type WeeklyChestPanelProps = {
    weeklyChest: {
        id: number
        bonusString: string
        itemLevel: number
    }
}

const WeeklyChestPanel = ({ weeklyChest }: WeeklyChestPanelProps) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4 w-full">
            <h2 className="text-xl font-bold mb-2">Weekly Chest</h2>
            <p>ID: {weeklyChest.id}</p>
            <p>Bonus String: {weeklyChest.bonusString}</p>
            <p>Item Level: {weeklyChest.itemLevel}</p>
        </div>
    )
}

type CurrenciesPanelProps = {
    currencies: Array<{
        id: number
        type: string
        amount: number
    }>
}

const CurrenciesPanel = ({ currencies }: CurrenciesPanelProps) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4 w-full">
            <h2 className="text-xl font-bold mb-2">Currencies</h2>
            {currencies.map((currency) => (
                <div key={currency.id} className="mb-2">
                    <p>Type: {currency.type}</p>
                    <p>Amount: {currency.amount}</p>
                </div>
            ))}
        </div>
    )
}

type WoWAuditPanelProps = {
    data: any // Replace 'any' with the actual type of wowauditData when available
}

const WoWAuditPanel = ({ data }: WoWAuditPanelProps) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4 w-full">
            <h2 className="text-xl font-bold mb-2">WoWAudit Data</h2>
            {/* Add WoWAudit data display here */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}
