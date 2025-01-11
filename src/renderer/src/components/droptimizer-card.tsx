import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/raid'
import { formatUnixTimestampToRelativeDays, getDpsHumanReadable } from '@renderer/lib/utils'
import { Boss, Droptimizer, Item } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import DroptimizerDetailDialog from './droptimizer-detail-dialog'
import { Dialog, DialogTrigger } from './ui/dialog'
import { WowItemIcon } from './ui/wowitem-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type DroptimizerCardProps = {
    droptimizer: Droptimizer
}

export const DroptimizerCard = ({ droptimizer: dropt }: DroptimizerCardProps) => {
    // droptimizer detail dialog
    const [isOpen, setOpen] = useState(false)
    const itemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, dropt.raidInfo.id],
        queryFn: () => fetchRaidLootTable(dropt.raidInfo.id)
    })
    const bosses: Boss[] = itemRes.data ?? []
    const raidItems: Item[] = itemRes.data?.flatMap((boss) => boss.items) ?? []
    const raidItemsIsLoading = itemRes.isLoading
    return (
        <>
            {raidItemsIsLoading ? (
                <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                    <LoaderCircle className="animate-spin text-5xl" />
                </div>
            ) : (
                <Dialog open={isOpen} onOpenChange={setOpen}>
                    <div className="flex flex-col justify-between p-6 bg-muted h-[230px] w-[310px] rounded-lg relative">
                        {/* Character Info */}
                        <div className="flex items-center space-x-3">
                            <WowSpecIcon
                                specId={dropt.charInfo.specId}
                                className="object-cover object-top rounded-md full h-10 w-10 border border-background"
                            />
                            <h2 className="font-black">{dropt.charInfo.name}</h2>
                        </div>

                        {/* Droptimizer Info */}
                        <div className="text-xs mt-3">
                            <p>
                                <strong>Raid Difficulty:</strong> {dropt.raidInfo.difficulty}
                            </p>
                            <p>
                                <strong>Fight Style:</strong> {dropt.simInfo.fightstyle} (
                                {dropt.simInfo.nTargets}) {dropt.simInfo.duration} sec
                            </p>
                            <p title={new Date(dropt.simInfo.date * 1000).toLocaleString()}>
                                <strong>Date: </strong>
                                {formatUnixTimestampToRelativeDays(dropt.simInfo.date)}
                            </p>
                            <DialogTrigger asChild className="cursor-pointer q3 links">
                                <p>
                                    <strong>Upgrades:</strong> {dropt.upgrades?.length}
                                </p>
                            </DialogTrigger>
                        </div>
                        {raidItemsIsLoading ? (
                            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                                <LoaderCircle className="animate-spin text-5xl" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 mt-1">
                                {dropt.upgrades &&
                                    dropt.upgrades
                                        .sort((a, b) => b.dps - a.dps)
                                        .slice(0, 7)
                                        .map((upgrade) => {
                                            const foundItem = raidItems.find(
                                                (item) => item.id === upgrade.item.id
                                            )
                                            return (
                                                <div
                                                    className="-mr-4 relative group"
                                                    key={upgrade.item.id}
                                                >
                                                    {foundItem ? (
                                                        <WowItemIcon
                                                            item={foundItem}
                                                            iconOnly={true}
                                                            raidDiff={dropt.raidInfo.difficulty}
                                                            catalystBanner={
                                                                upgrade.catalyzedItem != null
                                                            }
                                                            className="mt-2"
                                                            iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                                                        />
                                                    ) : (
                                                        <a
                                                            href={`https://www.wowhead.com/item=${upgrade.item.id}`}
                                                            rel="noreferrer"
                                                            target="_blank"
                                                            className="q3 links"
                                                        >
                                                            <p>{upgrade.item.id}</p>
                                                        </a>
                                                    )}
                                                    <p className="text-xs text-center">
                                                        <strong>
                                                            {getDpsHumanReadable(upgrade.dps)}
                                                        </strong>
                                                    </p>
                                                </div>
                                            )
                                        })}
                            </div>
                        )}
                    </div>
                    <DroptimizerDetailDialog droptimizer={dropt} bosses={bosses} />
                </Dialog>
            )}
        </>
    )
}
