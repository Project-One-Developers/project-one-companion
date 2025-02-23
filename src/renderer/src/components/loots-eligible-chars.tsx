import { TooltipArrow } from '@radix-ui/react-tooltip'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { assignLoot, getLootAssignmentInfo } from '@renderer/lib/tanstack-query/loots'
import { ITEM_SLOTS_KEY_TIERSET } from '@shared/consts/wow.consts'
import { isHealerItem, isTankItem } from '@shared/libs/spec-parser/spec-utils'
import type {
    CharAssignmentHighlights,
    CharAssignmentInfo,
    LootWithAssigned
} from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { HeartCrackIcon, LoaderCircle, MoreVertical, ShieldAlertIcon } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'
import { DroptimizerUpgradeForItemEquipped } from './droptimizer-upgrade-for-item'
import { toast } from './hooks/use-toast'
import TiersetInfo from './tierset-info'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowGearIcon } from './ui/wowgear-icon'

type LootsEligibleCharsProps = {
    selectedLoot: LootWithAssigned
    setSelectedLoot: (loot: LootWithAssigned) => void
    allLoots: LootWithAssigned[]
}

const sortEligibleCharacters = (a: CharAssignmentInfo, b: CharAssignmentInfo) => {
    if (b.highlights.score !== a.highlights.score) return b.highlights.score - a.highlights.score
    if (b.highlights.gearIsBis !== a.highlights.gearIsBis) return b.highlights.gearIsBis ? 1 : -1
    if (b.highlights.isTrackUpgrade !== a.highlights.isTrackUpgrade)
        return b.highlights.isTrackUpgrade ? 1 : -1
    return b.highlights.isMain ? 1 : -1
}

export default function LootsEligibleChars({
    selectedLoot,
    setSelectedLoot,
    allLoots
}: LootsEligibleCharsProps): JSX.Element {
    const [showAlts, setShowAlts] = useState(false)
    const lootAssignmentInfoQuery = useQuery({
        queryKey: [queryKeys.lootsAssignInfo, selectedLoot.id],
        queryFn: () => getLootAssignmentInfo(selectedLoot.id)
    })
    const eligibleCharacters = useMemo(() => {
        if (!lootAssignmentInfoQuery.data) return []

        return lootAssignmentInfoQuery.data.eligible
            .filter(({ character }) => showAlts || character.main)
            .sort(sortEligibleCharacters)
    }, [lootAssignmentInfoQuery.data, showAlts])

    const assignLootMutation = useMutation({
        mutationFn: ({
            charId,
            lootId,
            highlights: highlights
        }: {
            charId: string
            lootId: string
            highlights: CharAssignmentHighlights
        }) => assignLoot(charId, lootId, highlights),
        onMutate: async (variables) => {
            // Optimistically update the selected loot assignment
            const previousSelectedLoot = { ...selectedLoot }
            setSelectedLoot({
                ...selectedLoot,
                assignedCharacterId: variables.charId
            })

            // Return a rollback function
            return { previousSelectedLoot }
        },
        onError: (error, _, context) => {
            // Rollback to the previous state
            if (context?.previousSelectedLoot) {
                setSelectedLoot(context.previousSelectedLoot)
            }
            toast({
                title: 'Error',
                description: `Unable to assign loot. Error: ${error.message}`
            })
        },
        onSettled: () => {
            // we dont need to refetch the loot assignment info, we just need to refetch the loots from the parent to also refresh loot tabs panel
            queryClient.invalidateQueries({
                queryKey: [queryKeys.lootsBySession]
            })
        }
    })

    if (lootAssignmentInfoQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const showTiersetInfo =
        selectedLoot.gearItem.item.slotKey === 'omni' ||
        ITEM_SLOTS_KEY_TIERSET.find((i) => i === selectedLoot.gearItem.item.slotKey) != null
    const showHightestInSlot = selectedLoot.gearItem.item.slotKey !== 'omni'

    return (
        <div className="flex flex-col gap-4 relative">
            <div className="absolute top-4 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="p-2 rounded hover:bg-gray-700"
                        aria-label="More options"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuCheckboxItem
                            className="cursor-pointer"
                            checked={showAlts}
                            onCheckedChange={setShowAlts}
                        >
                            Show Alts
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-row justify-center items-center p-2 rounded-lg gap-4">
                <WowGearIcon
                    item={selectedLoot.gearItem}
                    showSlot={true}
                    showTierBanner={true}
                    showExtendedInfo={true}
                    showArmorType={true}
                    iconClassName="h-12 w-12"
                />
                {lootAssignmentInfoQuery.data &&
                    isTankItem(lootAssignmentInfoQuery.data?.loot.item) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ShieldAlertIcon className="cursor-pointer text-yellow-300" />
                            </TooltipTrigger>
                            <TooltipContent className="TooltipContent" sideOffset={5}>
                                Tank Item
                                <TooltipArrow className="TooltipArrow" />
                            </TooltipContent>
                        </Tooltip>
                    )}
                {lootAssignmentInfoQuery.data &&
                    isHealerItem(lootAssignmentInfoQuery.data?.loot.item) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HeartCrackIcon className="cursor-pointer text-yellow-300" />
                            </TooltipTrigger>
                            <TooltipContent className="TooltipContent" sideOffset={5}>
                                Healer Item
                                <TooltipArrow className="TooltipArrow" />
                            </TooltipContent>
                        </Tooltip>
                    )}
            </div>
            <div className="flex">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Highlights</TableHead>
                            <TableHead>Droptimizer</TableHead>
                            {showHightestInSlot && <TableHead>Highest</TableHead>}
                            <TableHead>Other Assignment</TableHead>
                            <TableHead>Vault</TableHead>
                            {showTiersetInfo && <TableHead>Tierset</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {eligibleCharacters.map((charInfo) => {
                            const assignedLoots = allLoots.filter(
                                (loot) =>
                                    loot.id !== selectedLoot.id &&
                                    loot.assignedCharacterId === charInfo.character.id &&
                                    loot.gearItem.item.slotKey ===
                                        selectedLoot.gearItem.item.slotKey
                            )
                            return (
                                <TableRow
                                    key={charInfo.character.id}
                                    className={`cursor-pointer hover:bg-gray-700 ${selectedLoot.assignedCharacterId === charInfo.character.id ? 'bg-green-800' : ''}`}
                                    onClick={() =>
                                        assignLootMutation.mutate({
                                            charId: charInfo.character.id,
                                            lootId: selectedLoot.id,
                                            highlights: charInfo.highlights
                                        })
                                    }
                                >
                                    <TableCell>
                                        <div className="flex flex-row space-x-4 items-center">
                                            <WowClassIcon
                                                wowClassName={charInfo.character.class}
                                                charname={charInfo.character.name}
                                                className="h-8 w-8 border-2 border-background rounded-lg"
                                            />
                                            <div className="flex flex-col">
                                                <h1 className="font-bold">
                                                    {charInfo.character.name}
                                                </h1>
                                                <p className="text-xs">
                                                    {charInfo.highlights?.score ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row space-x-4 items-center">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-bold text-green-400">
                                                    {charInfo.highlights.gearIsBis && 'BIS'}
                                                </p>
                                                <p className="text-xs font-bold">
                                                    {charInfo.highlights.tierSetCompletion.type ===
                                                        '2p' && '2p'}
                                                </p>
                                                <p className="text-xs font-bold">
                                                    {charInfo.highlights.tierSetCompletion.type ===
                                                        '4p' && '4p'}
                                                </p>
                                                <p className="text-xs font-bold text-blue-200">
                                                    {charInfo.highlights.dpsGain > 0 && 'DPS'}
                                                </p>
                                                <p className="text-xs font-bold">
                                                    {(charInfo.highlights.ilvlDiff > 0 ||
                                                        charInfo.highlights.isTrackUpgrade) &&
                                                        'SLOT'}
                                                </p>
                                                <p className="text-xs font-bold text-yellow-400 ">
                                                    {charInfo.highlights.alreadyGotIt &&
                                                        'ALREADY GOT IT'}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {charInfo.droptimizers.map((droptWithUpgrade) => (
                                            <DroptimizerUpgradeForItemEquipped
                                                key={droptWithUpgrade.droptimizer.url}
                                                upgrade={droptWithUpgrade.upgrade}
                                                droptimizer={droptWithUpgrade.droptimizer}
                                                itemEquipped={droptWithUpgrade.itemEquipped}
                                            />
                                        ))}
                                    </TableCell>
                                    {showHightestInSlot && (
                                        <TableCell>
                                            <div className="flex flex-row space-x-1">
                                                {charInfo.bestItemsInSlot.map((bestInSlot) => (
                                                    <WowGearIcon
                                                        key={bestInSlot.item.id}
                                                        item={bestInSlot}
                                                        showTierBanner={true}
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <div className="flex flex-row space-x-1">
                                            {assignedLoots.map((otherLoot) => (
                                                <WowGearIcon
                                                    key={otherLoot.id}
                                                    item={otherLoot.gearItem}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row space-x-1">
                                            {charInfo.weeklyChest
                                                .filter(
                                                    (vault) =>
                                                        vault.item.slotKey ===
                                                        selectedLoot.gearItem.item.slotKey
                                                )
                                                .map((gear) => (
                                                    <WowGearIcon key={gear.item.id} item={gear} />
                                                ))}
                                        </div>
                                    </TableCell>
                                    {showTiersetInfo && (
                                        <TableCell>
                                            <TiersetInfo tierset={charInfo.tierset} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
