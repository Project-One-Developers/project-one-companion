import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { deleteDroptimizer } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getDpsHumanReadable } from '@renderer/lib/utils'
import { formatUnixTimestampToRelativeDays } from '@shared/libs/date/date-utils'
import {
    BossWithItems,
    Character,
    Droptimizer,
    DroptimizerUpgrade,
    Item,
    WowRaidDifficulty
} from '@shared/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DroptimizerDetailDialog from './droptimizer-detail-dialog'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from './ui/dialog'
import { WowItemIcon } from './ui/wowitem-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

const CharacterInfo = ({
    charInfo
}: {
    charInfo: Droptimizer['charInfo'] & { charId?: string }
}) => {
    const navigate = useNavigate()

    return (
        <div className="flex items-center space-x-3">
            <WowSpecIcon
                specId={charInfo.specId}
                className="object-cover object-top rounded-md full h-10 w-10 border border-background"
            />
            {charInfo.charId ? (
                <div
                    className="font-black cursor-pointer"
                    onClick={() => navigate(`/roster/${charInfo.charId}`)}
                >
                    {charInfo.name}
                </div>
            ) : (
                <h2 className="font-black">{charInfo.name}</h2>
            )}
        </div>
    )
}

const DroptimizerInfo = ({ dropt, bosses }: { dropt: Droptimizer; bosses: BossWithItems[] }) => {
    const [isOpen, setOpen] = useState(false)
    const isStandard = dropt.simInfo.nTargets === 1 && dropt.simInfo.duration === 300
    return (
        <div className={'text-xs mt-3'}>
            <p>
                <strong>Raid Difficulty:</strong> {dropt.raidInfo.difficulty}
            </p>
            <p>
                <strong>Fight Style:</strong>{' '}
                <span className={isStandard ? '' : 'text-red-500'}>
                    {dropt.simInfo.fightstyle} ({dropt.simInfo.nTargets}) {dropt.simInfo.duration}{' '}
                    sec
                </span>
            </p>
            <p title={new Date(dropt.simInfo.date * 1000).toLocaleString()}>
                <strong>Date: </strong>
                {formatUnixTimestampToRelativeDays(dropt.simInfo.date)}
            </p>
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <DialogTrigger asChild className="cursor-pointer q3 links">
                    <p>
                        <strong>Upgrades:</strong> {dropt.upgrades.length}
                    </p>
                </DialogTrigger>
                <DroptimizerDetailDialog droptimizer={dropt} bosses={bosses} />
            </Dialog>
        </div>
    )
}

const UpgradeItem = ({
    upgrade,
    raidItems,
    raidDifficulty
}: {
    upgrade: DroptimizerUpgrade
    raidItems: Item[]
    raidDifficulty: WowRaidDifficulty
}) => {
    const foundItem = raidItems.find((item) => item.id === upgrade.item.id)

    return (
        <div className="-mr-4 relative group">
            {foundItem ? (
                <WowItemIcon
                    item={foundItem}
                    iconOnly={true}
                    raidDiff={raidDifficulty}
                    catalystBanner={upgrade.catalyzedItemId != null}
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
                <strong>{getDpsHumanReadable(upgrade.dps)}</strong>
            </p>
        </div>
    )
}

type DroptimizerCardProps = {
    droptimizer: Droptimizer
    character?: Character
}

export const DroptimizerCard = ({ droptimizer: dropt, character }: DroptimizerCardProps) => {
    const queryClient = useQueryClient()
    const { data: bosses = [], isLoading } = useQuery({
        queryKey: [queryKeys.raidLootTable, dropt.raidInfo.id],
        queryFn: () => fetchRaidLootTable(dropt.raidInfo.id)
    })

    const deleteMutation = useMutation({
        mutationFn: deleteDroptimizer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.droptimizers] })
        }
    })

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (
            window.confirm(`Are you sure you want to delete ${dropt.charInfo.name}'s droptimizer?`)
        ) {
            deleteMutation.mutate(dropt.url)
        }
    }

    const raidItems = bosses.flatMap((boss) => boss.items)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-between p-6 bg-muted h-[230px] w-[310px] rounded-lg relative">
            {/* Top Right Menu */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-2"
                onClick={handleDelete}
            >
                <X className="h-4 w-4" />
            </Button>

            {/* Spec Icon + Name */}
            <CharacterInfo charInfo={{ ...dropt.charInfo, charId: character?.id }} />

            {/* Sim summary + detail dialog*/}
            <DroptimizerInfo dropt={dropt} bosses={bosses} />

            {/* Upgrades */}
            <div className="flex items-center gap-3 mt-1">
                {dropt.upgrades
                    ?.sort((a, b) => b.dps - a.dps)
                    .slice(0, 7)
                    .map((upgrade) => (
                        <UpgradeItem
                            key={upgrade.item.id}
                            upgrade={upgrade}
                            raidItems={raidItems}
                            raidDifficulty={dropt.raidInfo.difficulty}
                        />
                    ))}
            </div>
        </div>
    )
}
