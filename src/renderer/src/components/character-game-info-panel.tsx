import * as Tabs from '@radix-ui/react-tabs'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getCharacterGameInfo } from '@renderer/lib/tanstack-query/players'
import { formaUnixTimestampToItalianDate } from '@renderer/lib/utils'
import { Character, CharacterWowAudit } from '@shared/types/types'
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
                <div className="flex flex-col justify-between p-6 bg-muted rounded-lg relative">
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
            {currencies
                .sort((a, b) => a.id - b.id)
                .map((currency) => (
                    <WowCurrencyIcon
                        key={currency.id}
                        currency={currency}
                        iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
                    />
                ))}
        </div>
    )
}

type WoWAuditPanelProps = {
    data: CharacterWowAudit
}

const WoWAuditPanel = ({ data }: WoWAuditPanelProps) => {
    return (
        <div className="p-4 rounded-lg  w-full relative">
            {/* Top right corner icon and last update info */}
            <div className="absolute top-4 right-4 flex items-center">
                <img
                    src="https://data.wowaudit.com/img/new-logo-icon.svg"
                    alt="Character Icon"
                    className="w-8 h-8 rounded-full mr-2"
                />
                <p className="text-sm">
                    Last Update: {formaUnixTimestampToItalianDate(data.wowauditLastModifiedUnixTs)}
                </p>
            </div>
            {/* Character Info Panel */}
            <div className="rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p>
                            <strong>Highest Item Level:</strong>{' '}
                            {data.hightestIlvlEverEquipped || 'N/A'}
                        </p>
                        <p>
                            <strong>Mythic Dungeons This Week:</strong>{' '}
                            {data.weekMythicDungeons || 0}
                        </p>
                        <p>
                            <strong>Empty Sockets:</strong> {data.emptySockets || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* WowAudit Best Gear info */}
            <Tabs.Root defaultValue="best" className="w-full">
                <Tabs.List className="flex border-b mb-4">
                    <Tabs.Trigger
                        value="best"
                        className="px-4 py-2 flex-1 text-center hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Best Gear
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="current"
                        className="px-4 py-2 flex-1 flex items-center justify-center space-x-2 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Current Gear
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="best" className="p-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="">
                                <th className="text-left">ILvl</th>
                                <th className="text-left">Slot</th>
                                <th className="text-left">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data.bestGear).map(([key, value]) => (
                                <tr key={key} className="border-t">
                                    <td className="">{value.ilvl}</td>
                                    <td className="">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </td>
                                    <td className="">
                                        <a
                                            className="q3 links"
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`https://www.wowhead.com/item=${value.id}?ilvl=${value.ilvl}`}
                                        >
                                            {value.name}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Tabs.Content>
                <Tabs.Content value="current" className="p-4">
                    <></>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    )
}
