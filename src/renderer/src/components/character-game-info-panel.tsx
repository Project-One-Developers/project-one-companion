import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getCharacterGameInfo } from '@renderer/lib/tanstack-query/players'
import { formatUnixTimestampForDisplay } from '@shared/libs/date/date-utils'
import { Character, CharacterWowAudit, Droptimizer } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import DroptimizerData from './droptimizer-data'
import { CurrentGreatVaultPanel } from './greatvault-current-panel'
import { NextGreatVaultPanel } from './greatvault-next-panel'
import { WowCurrencyIcon } from './ui/wowcurrency-icon'
import WowAuditData from './wow-audit-data'

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

    const droptimizer = charGameInfoQuery.data?.droptimizer ?? null
    const currencies = charGameInfoQuery.data?.droptimizer?.currencies ?? null
    const wowauditData = charGameInfoQuery.data?.wowaudit ?? null
    const nextWeekChest = wowauditData?.greatVault ?? null

    return (
        <>
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                <CurrenciesPanel currencies={currencies} />
                <CurrentGreatVaultPanel droptimizer={droptimizer} />
                <NextGreatVaultPanel greatVault={nextWeekChest} />
            </div>
            <div className="flex flex-col justify-between p-6 bg-muted rounded-lg relative">
                <GearInfo wowAudit={wowauditData} droptimizer={droptimizer} />
            </div>
        </>
    )
}

type CurrenciesPanelProps = {
    currencies: Array<{
        id: number
        type: string
        amount: number
    }> | null
}

export const CurrenciesPanel = ({ currencies }: CurrenciesPanelProps) => {
    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            {/* Character Info Panel */}
            {/* <div className="rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p>
                            <strong>Mythic Dungeons This Week:</strong>{' '}
                            {wowAudit.weekMythicDungeons || 0}
                        </p>
                        <p>
                            <strong>Empty Sockets:</strong> {wowAudit.emptySockets || 'N/A'}
                        </p>
                    </div>
                </div>
            </div> */}
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
                        .map(currency => (
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

type GearInfoProps = {
    wowAudit: CharacterWowAudit | null
    droptimizer: Droptimizer | null
}

const GearInfo = ({ wowAudit, droptimizer }: GearInfoProps) => {
    let wowAuditNewer = wowAudit != null
    if (droptimizer && wowAudit) {
        if (droptimizer.simInfo.date > wowAudit.wowauditLastModifiedUnixTs) {
            wowAuditNewer = false
        }
    }
    return (
        <div className="p-4 rounded-lg w-full relative bg-background shadow-lg">
            <Tabs defaultValue={wowAuditNewer ? 'wowaudit' : 'droptimizer'} className="w-full">
                <TabsList className="flex justify-start space-x-4 border-b pb-2">
                    <TabsTrigger
                        value="wowaudit"
                        className="flex flex-col items-start gap-1 px-4 py-2 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src="https://data.wowaudit.com/img/new-logo-icon.svg"
                                className="w-6 h-6 rounded-full"
                            />
                            <span>WoW Audit</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {wowAudit
                                ? formatUnixTimestampForDisplay(wowAudit.wowauditLastModifiedUnixTs)
                                : 'No wowaudit imported'}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="droptimizer"
                        className="flex flex-col items-start gap-1 px-4 py-2 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src="https://assets.rpglogs.com/img/warcraft/raidbots-icon.png"
                                className="w-6 h-6 rounded-full"
                            />
                            <span>Droptimizer</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {droptimizer
                                ? formatUnixTimestampForDisplay(droptimizer.simInfo.date)
                                : 'No droptimizer imported'}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wowaudit">
                    {wowAudit && <WowAuditData wowAudit={wowAudit} />}
                </TabsContent>

                <TabsContent value="droptimizer">
                    {droptimizer && <DroptimizerData droptimizer={droptimizer} />}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default GearInfo
