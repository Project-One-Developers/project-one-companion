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
                {/* Todo: Diventa tierset panel: deve combinare info raidbot + wowaudit */}
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
            {/* Character Info Panel */}
            <div className="rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
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
            <table className="w-full border-collapse">
                <thead>
                    <tr className="">
                        <th className="text-left">Slot</th>
                        <th className="text-left">
                            <div className="flex items-center">
                                RaidBot
                                <img
                                    src="https://assets.rpglogs.com/img/warcraft/raidbots-icon.png"
                                    alt="Character Icon"
                                    className="w-6 h-6 rounded-full ml-2"
                                />
                            </div>
                        </th>
                        <th className="text-left">
                            <div className="flex items-center">
                                Best Gear • {data.hightestIlvlEverEquipped || 'N/A'}
                                <img
                                    src="https://data.wowaudit.com/img/new-logo-icon.svg"
                                    title={`Last Update: ${formaUnixTimestampToItalianDate(data.wowauditLastModifiedUnixTs)}`}
                                    className="w-6 h-6 rounded-full ml-2"
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.bestGear).map(([key, value]) =>
                        value ? (
                            <tr key={key} className="border-t">
                                <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                <td>
                                    <WowItemIcon
                                        item={value.id}
                                        iconOnly={false}
                                        ilvl={value.ilvl}
                                        showIlvl={true}
                                        showSubclass={false}
                                        showSlot={false}
                                        iconClassName="object-cover object-top rounded-lg h-10 w-10 border border-background"
                                    />
                                </td>
                                <td>
                                    <WowItemIcon
                                        item={value.id}
                                        iconOnly={false}
                                        ilvl={value.ilvl}
                                        showIlvl={true}
                                        showSubclass={false}
                                        showSlot={false}
                                        iconClassName="object-cover object-top rounded-lg h-10 w-10 border border-background"
                                    />
                                </td>
                            </tr>
                        ) : null
                    )}
                </tbody>
            </table>
        </div>
    )
}
