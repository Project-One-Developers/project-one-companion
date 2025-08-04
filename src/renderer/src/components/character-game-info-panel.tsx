
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getCharacterGameInfo } from '@renderer/lib/tanstack-query/players'
import { formatUnixTimestampForDisplay } from '@shared/libs/date/date-utils'
import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { Character, CharacterWowAudit, Droptimizer } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import DroptimizerData from './droptimizer-data'
import { CurrentGreatVaultPanel } from './greatvault-current-panel'
import { NextGreatVaultPanel } from './greatvault-next-panel'
import RaiderioData from './raiderio-data'
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
    const raiderioData = charGameInfoQuery.data?.raiderio ?? null
    const nextWeekChest = wowauditData?.greatVault ?? null

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Secondary Info */}
            <div className="col-span-3 space-y-4">
                <CurrenciesPanel currencies={currencies} />
                <CurrentGreatVaultPanel droptimizer={droptimizer} />
                <NextGreatVaultPanel greatVault={nextWeekChest} />
            </div>

            {/* Main Content - Character Gear */}
            <div className="col-span-9">
                <div className="bg-muted rounded-lg relative">
                    <GearInfo
                        wowAudit={wowauditData}
                        droptimizer={droptimizer}
                        raiderio={raiderioData}
                    />
                </div>
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

export const CurrenciesPanel = ({ currencies }: CurrenciesPanelProps) => {
    return (
        <div className="flex flex-col p-4 bg-muted rounded-lg relative">
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold">Currencies</p>
            </div>
            <div className="space-y-3">
                {!currencies ? (
                    <div className="text-xs text-muted-foreground">No currency info found</div>
                ) : (
                    currencies
                        .sort((a, b) => a.id - b.id)
                        .map(currency => (
                            <div key={currency.id} className="flex items-center gap-2">
                                <WowCurrencyIcon
                                    currency={currency}
                                    iconClassName="object-cover object-top rounded-lg h-6 w-6 border border-background"
                                />
                                <span className="text-sm font-medium">{currency.amount.toLocaleString()}</span>
                            </div>
                        ))
                )}
            </div>
        </div>
    )
}

type GearInfoProps = {
    wowAudit: CharacterWowAudit | null
    droptimizer: Droptimizer | null
    raiderio: CharacterRaiderio | null
}

const GearInfo = ({ wowAudit, droptimizer, raiderio }: GearInfoProps) => {
    let wowAuditNewer = wowAudit != null
    if (droptimizer && wowAudit) {
        if (droptimizer.simInfo.date > wowAudit.wowauditLastModifiedUnixTs) {
            wowAuditNewer = false
        }
    }
    return (
        <div className="p-6 rounded-lg w-full relative bg-background shadow-lg">
            <Tabs defaultValue={wowAuditNewer ? 'wowaudit' : 'droptimizer'} className="w-full">
                <TabsList className="flex justify-start space-x-4 border-b pb-2 mb-6">
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
                    <TabsTrigger
                        value="raiderio"
                        className="flex flex-col items-start gap-1 px-4 py-2 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src="https://cdn.raiderio.net/images/mstile-150x150.png"
                                className="w-6 h-6 rounded-full"
                            />
                            <span>RaiderIO</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {raiderio
                                ? formatUnixTimestampForDisplay(raiderio.p1SyncAt)
                                : 'No raiderio imported'}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wowaudit">
                    {wowAudit && <WowAuditData data={wowAudit} />}
                </TabsContent>

                <TabsContent value="droptimizer">
                    {droptimizer && <DroptimizerData data={droptimizer} />}
                </TabsContent>
                <TabsContent value="raiderio">
                    {raiderio && <RaiderioData data={raiderio} />}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default GearInfo
