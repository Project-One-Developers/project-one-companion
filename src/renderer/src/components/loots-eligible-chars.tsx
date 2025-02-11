import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { assignLoot, getLootAssignmentInfo } from '@renderer/lib/tanstack-query/loots'
import type { LootWithItemAndAssigned } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { type JSX } from 'react'
import { DroptimizerUpgradeForItemEquipped } from './droptimizer-upgrade-for-item'
import { toast } from './hooks/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowItemIcon } from './ui/wowitem-icon'

type LootsEligibleCharsProps = {
    selectedLoot: LootWithItemAndAssigned
    setSelectedLoot: (loot: LootWithItemAndAssigned) => void
    allLoots: LootWithItemAndAssigned[]
}

export default function LootsEligibleChars({
    selectedLoot,
    setSelectedLoot,
    allLoots
}: LootsEligibleCharsProps): JSX.Element {
    const lootAssignmentInfoQuery = useQuery({
        queryKey: [queryKeys.lootsAssignInfo, selectedLoot.id],
        queryFn: () => getLootAssignmentInfo(selectedLoot.id)
    })

    const assignLootMutation = useMutation({
        mutationFn: ({
            charId,
            lootId,
            score
        }: {
            charId: string
            lootId: string
            score?: number
        }) => assignLoot(charId, lootId, score),
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
                //queryKey: [queryKeys.lootsAssignInfo, selectedLoot.id] queryKeys.lootsBySession
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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-center">
                <WowItemIcon
                    item={selectedLoot.item}
                    iconOnly={false}
                    raidDiff={selectedLoot.raidDifficulty}
                    bonusString={selectedLoot.bonusString}
                    socketBanner={selectedLoot.socket}
                    tierBanner={true}
                    iconClassName="object-cover object-top rounded-lg h-12 w-12 border border-background"
                />
            </div>
            <div className="flex">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Droptimizer</TableHead>
                            <TableHead>Weekly Chest</TableHead>
                            <TableHead>BiS</TableHead>
                            <TableHead>Already Assigned</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lootAssignmentInfoQuery.data?.eligible.map((charInfo) => {
                            const assignedLoots = allLoots.filter(
                                (loot) =>
                                    loot.id !== selectedLoot.id &&
                                    loot.assignedCharacterId === charInfo.character.id &&
                                    loot.item.slotKey === selectedLoot.item.slotKey
                            )
                            return (
                                <TableRow
                                    key={charInfo.character.id}
                                    className={`cursor-pointer hover:bg-gray-700 ${selectedLoot.assignedCharacterId === charInfo.character.id ? 'bg-gray-700' : ''}`}
                                    onClick={() =>
                                        assignLootMutation.mutate({
                                            charId: charInfo.character.id,
                                            lootId: selectedLoot.id,
                                            score: charInfo.score
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
                                            <h1 className="font-bold mb-2">
                                                {charInfo.character.name}
                                            </h1>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {charInfo.droptimizers &&
                                            charInfo.droptimizers.map((droptWithUpgrade) => (
                                                <DroptimizerUpgradeForItemEquipped
                                                    key={droptWithUpgrade.itemEquipped.item.id}
                                                    upgrade={droptWithUpgrade.upgrade}
                                                    droptimizer={droptWithUpgrade.droptimizer}
                                                    itemEquipped={droptWithUpgrade.itemEquipped}
                                                />
                                            ))}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row 2">
                                            {charInfo.weeklyChest.map((wc) => (
                                                <div
                                                    key={wc.item.id}
                                                    className="flex flex-col items-center"
                                                >
                                                    <WowItemIcon
                                                        item={wc.item.id}
                                                        ilvl={wc.itemLevel}
                                                        iconOnly={true}
                                                        bonusString={wc.bonusString}
                                                        iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                                                    />
                                                    <p className="text-bold text-[11px]">
                                                        {wc.itemLevel}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>${'' + charInfo.bis}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-row 2">
                                            {assignedLoots.map((otherLoot) => (
                                                <div
                                                    key={otherLoot.id}
                                                    className="flex flex-col items-center space-x-1"
                                                >
                                                    <WowItemIcon
                                                        item={otherLoot.item}
                                                        raidDiff={otherLoot.raidDifficulty}
                                                        iconOnly={true}
                                                        tierBanner={true}
                                                        bonusString={otherLoot.bonusString}
                                                        iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                                                    />
                                                    <p className="text-bold text-[11px]">
                                                        {otherLoot.raidDifficulty}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{charInfo.score}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
