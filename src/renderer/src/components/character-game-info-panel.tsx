import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getCharacterGameInfo } from '@renderer/lib/tanstack-query/players'
import { Character } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { WowCurrencyIcon } from './ui/wowcurrency-icon'

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
        <>
            {gameInfo && gameInfo.currencies && (
                <div className="flex flex-col justify-between p-6 bg-muted w-[310px] rounded-lg relative">
                    <CurrenciesPanel currencies={gameInfo.currencies} />
                </div>
            )}

            {gameInfo && gameInfo.weeklyChest && (
                <div className="flex flex-col justify-between p-6 bg-muted w-[310px] rounded-lg relative">
                    <WeeklyChestPanel weeklyChest={gameInfo.weeklyChest} />
                </div>
            )}

            {wowauditData && (
                <div className="flex flex-col justify-between p-6 bg-muted h-[230px] w-[310px] rounded-lg relative">
                    <WoWAuditPanel data={wowauditData} />
                </div>
            )}
        </>
    )
}

type WeeklyChestPanelProps = {
    weeklyChest: {
        id: number
        bonusString: string
        itemLevel: number
    }[]
}

const WeeklyChestPanel = ({ weeklyChest }: WeeklyChestPanelProps) => {
    return (
        <>
            {weeklyChest.map((weeklyChest) => (
                // <WowItemIcon
                //     key={index}
                //     item={loot.item}
                //     iconOnly={true}
                //     raidDiff={loot.raidDifficulty}
                //     bonusString={loot.bonusString}
                //     socketBanner={loot.socket}
                //     tierBanner={true}
                //     className="mt-1"
                //     iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
                // />
                //                                                 )
                <div key={weeklyChest.id} className="">
                    <h2 className="text-xl font-bold mb-2">Weekly Chest</h2>
                    <p>ID: {weeklyChest.id}</p>
                    <p>Bonus String: {weeklyChest.bonusString}</p>
                    <p>Item Level: {weeklyChest.itemLevel}</p>
                </div>
            ))}
        </>
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
        <div className="flex flex-row items-center justify-between space-x-4">
            {currencies.map((currency) => (
                <WowCurrencyIcon
                    key={currency.id}
                    currency={currency}
                    className="mt-1"
                    iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
                />
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
