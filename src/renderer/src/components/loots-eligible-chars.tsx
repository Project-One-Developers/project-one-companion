import type { Character, Droptimizer, LootWithItem, WowRaidDifficulty } from '@shared/types/types'
import { type JSX } from 'react'
import { DroptimizersUpgradeForItem } from './droptimizer-upgrades-for-item'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowItemIcon } from './ui/wowitem-icon'

type LootsEligibleCharsProps = {
    roster: Character[]
    selectedLoot: LootWithItem | null
    droptimizers: Droptimizer[]
}

export default function LootsEligibleChars({
    roster,
    selectedLoot,
    droptimizers
}: LootsEligibleCharsProps): JSX.Element {
    if (!selectedLoot) {
        return <p className="text-gray-400">Select an item to start assigning</p>
    }

    const filteredRoster = roster.filter(
        (character) =>
            selectedLoot.charsEligibility.includes(character.id) &&
            (selectedLoot.item.classes == null ||
                selectedLoot.item.classes.includes(character.class))
    )

    const filterDroptimizersByDiffAndChar = (
        charName: string,
        charServer: string,
        diff: WowRaidDifficulty
    ) => {
        return droptimizers
            .filter(
                (dropt) =>
                    dropt.raidInfo.difficulty == diff &&
                    dropt.charInfo.name === charName &&
                    dropt.charInfo.server === charServer
            )
            .sort((a, b) => b.simInfo.date - a.simInfo.date)
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
                    iconClassName="object-cover object-top rounded-lg h-10 w-10 border border-background"
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
                        {filteredRoster.map((character) => {
                            const charDroptimizers = filterDroptimizersByDiffAndChar(
                                character.name,
                                character.realm,
                                selectedLoot.raidDifficulty
                            )
                            return (
                                <TableRow key={character.id}>
                                    <TableCell>
                                        <div className="flex flex-row space-x-4 items-center ">
                                            <WowClassIcon
                                                wowClassName={character.class}
                                                charname={character.name}
                                                className="h-8 w-8 border-2 border-background rounded-lg"
                                            />
                                            <h1 className="font-bold mb-2">{character.name}</h1>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DroptimizersUpgradeForItem
                                            item={selectedLoot.item}
                                            droptimizers={charDroptimizers}
                                            showUpgradeItem={true}
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        {Math.floor(Math.random() * (10000 - 10 + 1)) + 10}{' '}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
