import type { Character, LootWithItem } from '@shared/types/types'
import { type JSX } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

type LootsEligibleCharsProps = {
    roster: Character[]
    selectedLoot: LootWithItem | null
}

export default function LootsEligibleChars({
    roster,
    selectedLoot
}: LootsEligibleCharsProps): JSX.Element {
    if (!selectedLoot) {
        return <p className="text-gray-400">Select an item to assign</p>
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">{selectedLoot.item.name}</h3>
            <div className="flex flex-wrap gap-4">
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
                        {roster.map((character) => (
                            <TableRow key={character.id}>
                                <TableCell>
                                    {' '}
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
