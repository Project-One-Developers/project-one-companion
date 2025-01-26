import * as Tabs from '@radix-ui/react-tabs'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getCharacterGameInfo } from '@renderer/lib/tanstack-query/players'
import { formaUnixTimestampToItalianDate } from '@renderer/lib/utils'
import { Character, CharacterWowAudit } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { WowCurrencyIcon } from './ui/wowcurrency-icon'
import { WowItemIcon } from './ui/wowitem-icon'

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

    const currencies = charGameInfoQuery.data?.droptimizer?.currencies ?? null
    const weeklyChest = charGameInfoQuery.data?.droptimizer?.weeklyChest ?? null
    const wowauditData = charGameInfoQuery.data?.wowaudit ?? null

    return (
        <>
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                <CurrenciesPanel currencies={currencies} />
                <WeeklyChestPanel weeklyChests={weeklyChest} />
            </div>
            {wowauditData && (
                <div className="flex flex-col justify-between p-6 bg-muted rounded-lg relative">
                    <WoWAuditPanel data={wowauditData} />
                </div>
            )}
        </>
    )
}

type WeeklyChestPanelProps = {
    weeklyChests:
        | {
              id: number
              bonusString: string
              itemLevel: number
          }[]
        | null
}

const WeeklyChestPanel = ({ weeklyChests }: WeeklyChestPanelProps) => {
    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Weekly Chest</p>
                {/* <img
                    src={weeklyChestIcon}
                    alt="Weekly Chest Icon"
                    className="h-16 w-16 object-contain"
                /> */}
            </div>
            {/* Chest Items */}
            <div className="flex flex-wrap gap-2">
                {!weeklyChests ? <div>No weekly chest found</div> : null}
                {weeklyChests &&
                    weeklyChests.map((wc) => (
                        <WowItemIcon
                            key={wc.id}
                            item={wc.id}
                            iconOnly={false}
                            bonusString={wc.bonusString}
                            ilvl={wc.itemLevel}
                            iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                        />
                    ))}
            </div>
        </div>
    )
}

type CurrenciesPanelProps = {
    currencies: Array<{
        id: number
        type: string
        amount: number
    }> | null
}

const CurrenciesPanel = ({ currencies }: CurrenciesPanelProps) => {
    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Currencies</p>
                {/* <img
                    src={weeklyChestIcon}
                    alt="Weekly Chest Icon"
                    className="h-16 w-16 object-contain"
                /> */}
            </div>
            {/* Chest Items */}
            <div className="flex flex-row items-center justify-between space-x-4">
                {!currencies ? <div>No currency info found</div> : null}
                {currencies &&
                    currencies
                        .sort((a, b) => a.id - b.id)
                        .map((currency) => (
                            <WowCurrencyIcon
                                key={currency.id}
                                currency={currency}
                                iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
                            />
                        ))}
            </div>
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
