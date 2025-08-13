import { queryClient } from '@renderer/lib/tanstack-query/client'
import { fetchItemNote } from '@renderer/lib/tanstack-query/items'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { assignLoot, getLootAssignmentInfo, unassignLoot } from '@renderer/lib/tanstack-query/loots'
import { getDpsHumanReadable } from '@renderer/lib/utils'
import { ITEM_SLOTS_KEY_TIERSET } from '@shared/consts/wow.consts'
import { tierSetBonusSchema } from '@shared/schemas/wow.schemas'
import {
    DroptimizerWarn,
    type CharAssignmentHighlights,
    type CharAssignmentInfo,
    type LootWithAssigned
} from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Badge, LoaderCircle, MoreVertical, StickyNote } from 'lucide-react'
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
import { WowSpecIcon } from './ui/wowspec-icon'

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
    return a.highlights.alreadyGotIt ? 1 : -1
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

    // Query for item note
    const itemNoteQuery = useQuery({
        queryKey: [queryKeys.itemNote, selectedLoot.gearItem.item.id],
        queryFn: () => fetchItemNote(selectedLoot.gearItem.item.id),
        enabled: !!selectedLoot.gearItem.item.id
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
        onMutate: async variables => {
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

    const unassignLootMutation = useMutation({
        mutationFn: ({ lootId }: { lootId: string }) => unassignLoot(lootId),
        onMutate: async () => {
            // Optimistically update the selected loot assignment
            const previousSelectedLoot = { ...selectedLoot }
            setSelectedLoot({
                ...selectedLoot,
                assignedCharacterId: null
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
                description: `Unable to unassign loot. Error: ${error.message}`
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
        ITEM_SLOTS_KEY_TIERSET.find(i => i === selectedLoot.gearItem.item.slotKey) != null
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
                    gearItem={selectedLoot.gearItem}
                    showSlot={true}
                    showTiersetLine={true}
                    showExtendedInfo={true}
                    showArmorType={true}
                    showRoleIcons={true}
                    iconClassName="h-12 w-12"
                />
                {/* Item Note Badge */}
                {itemNoteQuery.data && itemNoteQuery.data.trim() !== '' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge className="flex items-center gap-1 max-w-xs cursor-help bg-blue-900/50 text-blue-100 border-blue-700">
                                <StickyNote className="h-3 w-3" />
                                <span className="truncate">
                                    {itemNoteQuery.data.length > 20
                                        ? `${itemNoteQuery.data.substring(0, 20)}...`
                                        : itemNoteQuery.data}
                                </span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="max-w-sm p-3 bg-gray-800 border-gray-600"
                        >
                            <div className="whitespace-pre-wrap break-words">
                                <strong className="text-blue-400">Item Note:</strong>
                                <br />
                                {itemNoteQuery.data}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <Table className="w-full cursor-pointer">
                <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800">
                        <TableHead className="text-gray-300 font-semibold">Name</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Highlights</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Droptimizer</TableHead>
                        {showHightestInSlot && (
                            <TableHead className="text-gray-300 font-semibold">Highest</TableHead>
                        )}
                        <TableHead className="text-gray-300 font-semibold">
                            Other Assignment
                        </TableHead>
                        {showTiersetInfo && (
                            <>
                                <TableHead className="text-gray-300 font-semibold">Tierset</TableHead>
                                <TableHead className="text-gray-300 font-semibold">Catalyst</TableHead>
                            </>
                        )}
                        <TableHead className="text-gray-300 font-semibold">Vault</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {eligibleCharacters.map(charInfo => {
                        const assignedLoots = allLoots.filter(
                            loot =>
                                loot.id !== selectedLoot.id &&
                                loot.assignedCharacterId === charInfo.character.id &&
                                loot.gearItem.item.slotKey === selectedLoot.gearItem.item.slotKey
                        )
                        return (
                            <TableRow
                                key={charInfo.character.id}
                                className={` py-2 cursor-pointer  hover:bg-gray-700  ${
                                    selectedLoot.assignedCharacterId === charInfo.character.id
                                        ? 'bg-green-900/50'
                                        : ''
                                }`}
                                onClick={() => {
                                    if (
                                        selectedLoot.assignedCharacterId === charInfo.character.id
                                    ) {
                                        unassignLootMutation.mutate({ lootId: selectedLoot.id })
                                    } else {
                                        assignLootMutation.mutate({
                                            charId: charInfo.character.id,
                                            lootId: selectedLoot.id,
                                            highlights: charInfo.highlights
                                        })
                                    }
                                }}
                            >
                                <TableCell className="rounded-l-md group-hover:border-l group-hover:border-t group-hover:border-b group-hover:border-white relative">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="h-8 w-8 flex items-center justify-center overflow-hidden">
                                                <WowClassIcon
                                                    wowClassName={charInfo.character.class}
                                                    charname={charInfo.character.name}
                                                    className="object-contain h-full w-full border-2 border-background rounded-lg"
                                                />
                                            </div>
                                            {/* CheckMark for awarded */}
                                            {selectedLoot.assignedCharacterId ===
                                                charInfo.character.id && (
                                                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3 text-white"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="font-bold text-gray-100">
                                                {charInfo.character.name}
                                            </h1>
                                            <p className="text-xs text-gray-400">
                                                Score: {charInfo.highlights?.score ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {charInfo.highlights.gearIsBis ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="px-2 py-1 text-xs font-bold bg-green-900/50 text-green-400 rounded-full">
                                                        BIS
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    className="TooltipContent"
                                                    sideOffset={5}
                                                >
                                                    <div className="flex flex-col gap-y-1">
                                                        {charInfo.bisForSpec.map(s => (
                                                            <div
                                                                key={s.id}
                                                                className="flex flex-row gap-2 items-center"
                                                            >
                                                                <WowSpecIcon
                                                                    specId={s.id}
                                                                    className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                                                                />
                                                                <p className="text-xs">{s.name}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : null}

                                        {charInfo.highlights.lootEnableTiersetBonus ===
                                            tierSetBonusSchema.enum['2p'] && (
                                            <span className="px-2 py-1 text-xs font-bold bg-purple-900/50 text-purple-400 rounded-full">
                                                2P
                                            </span>
                                        )}
                                        {charInfo.highlights.lootEnableTiersetBonus ===
                                            tierSetBonusSchema.enum['4p'] && (
                                            <span className="px-2 py-1 text-xs font-bold bg-purple-900/50 text-purple-400 rounded-full">
                                                4P
                                            </span>
                                        )}
                                        {charInfo.highlights.dpsGain > 0 && (
                                            <span className="px-2 py-1 text-xs font-bold bg-blue-900/50 text-blue-400 rounded-full">
                                                DPS +
                                                {getDpsHumanReadable(charInfo.highlights.dpsGain)}
                                            </span>
                                        )}
                                        {(charInfo.highlights.ilvlDiff > 0 ||
                                            charInfo.highlights.isTrackUpgrade) && (
                                            <span className="px-2 py-1 text-xs font-bold bg-yellow-900/50 text-yellow-400 rounded-full">
                                                SLOT
                                            </span>
                                        )}
                                        {charInfo.highlights.alreadyGotIt && (
                                            <span className="px-2 py-1 text-xs font-bold bg-gray-700/50 text-gray-300 rounded-full">
                                                OWNED
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col space-y-2">
                                        {charInfo.droptimizers.map(droptWithUpgrade => (
                                            <DroptimizerUpgradeForItemEquipped
                                                key={droptWithUpgrade.droptimizer.url}
                                                upgrade={droptWithUpgrade.upgrade}
                                                droptimizer={droptWithUpgrade.droptimizer}
                                                itemEquipped={droptWithUpgrade.itemEquipped}
                                            />
                                        ))}
                                        {charInfo.warnDroptimizer ===
                                            DroptimizerWarn.NotImported && (
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full flex items-center space-x-1 border border-yellow-400/50">
                                                    {/* Warning Icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span>
                                                        {charInfo.warnDroptimizer.toUpperCase()}
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                {showHightestInSlot && (
                                    <TableCell>
                                        <div className="flex space-x-1">
                                            {charInfo.bestItemsInSlot.map(bestInSlot => (
                                                <WowGearIcon
                                                    key={bestInSlot.item.id}
                                                    gearItem={bestInSlot}
                                                    showTiersetLine={true}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                )}

                                <TableCell>
                                    <div className="flex space-x-1">
                                        {assignedLoots.map(otherLoot => (
                                            <WowGearIcon
                                                key={otherLoot.id}
                                                gearItem={otherLoot.gearItem}
                                            />
                                        ))}
                                    </div>
                                </TableCell>

                                {showTiersetInfo && (
                                    <>
                                        <TableCell>
                                            <TiersetInfo tierset={charInfo.tierset} />
                                        </TableCell>
                                        <TableCell>
                                            {charInfo.catalystCharge}
                                        </TableCell>
                                    </>
                                )}
                                <TableCell className="rounded-r-md">
                                    <div className="flex space-x-1">
                                        {charInfo.weeklyChest
                                            .filter(
                                                vault =>
                                                    vault.item.slotKey ===
                                                    selectedLoot.gearItem.item.slotKey
                                            )
                                            .map(gear => (
                                                <WowGearIcon key={gear.item.id} gearItem={gear} />
                                            ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
