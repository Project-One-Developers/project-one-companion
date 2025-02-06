import type { Character, LootWithItem } from '@shared/types/types'
import { type JSX } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { WowItemIcon } from './ui/wowitem-icon'

type LootsEligibleCharsProps = {
    roster: Character[]
    selectedLoot: LootWithItem | null
}

export default function LootsEligibleChars({
    roster,
    selectedLoot
}: LootsEligibleCharsProps): JSX.Element {
    if (!selectedLoot) {
        return <p className="text-gray-400">Select an item to start assigning</p>
    }

    const eligibleChars: string[] = selectedLoot.charsEligibility
    const filteredRoster = roster.filter(
        (character) =>
            eligibleChars.includes(character.id) &&
            (selectedLoot.item.classes == null ||
                selectedLoot.item.classes.includes(character.class))
    )

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
                            <TableHead>P1 Score</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>BiS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoster.map((character) => (
                            <TableRow key={character.id}>
                                <TableCell>
                                    <div className="flex flex-row space-x-4 ">
                                        {/* <WowClassIcon
                                            wowClassName={character.class}
                                            charname={character.name}
                                            className="h-10 w-10 border-2 border-background rounded-lg"
                                        /> */}
                                        <h1 className=" font-bold mb-2">{character.name}</h1>
                                    </div>
                                </TableCell>
                                <TableCell>+10k</TableCell>
                                <TableCell>20000</TableCell>
                                <TableCell>#200192</TableCell>
                                <TableCell>No</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
