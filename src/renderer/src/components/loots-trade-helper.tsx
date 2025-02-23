import { LootWithAssigned } from '@shared/types/types'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { WowGearIcon } from './ui/wowgear-icon'

interface LootsTradeHelperDialogProps {
    isOpen: boolean
    setOpen: (open: boolean) => void
    loots: LootWithAssigned[]
}

export default function LootsTradeHelperDialog({
    isOpen,
    setOpen,
    loots
}: LootsTradeHelperDialogProps) {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
    const [copiedItemId, setCopiedItemId] = useState<string | null>(null)

    // Group loot by assigned character and sort by character name
    const lootByCharacter = Object.values(
        loots.reduce(
            (acc, loot) => {
                if (loot.assignedCharacter) {
                    const charId = loot.assignedCharacter.id
                    if (!acc[charId]) {
                        acc[charId] = {
                            character: loot.assignedCharacter,
                            loot: []
                        }
                    }
                    acc[charId].loot.push(loot)
                }
                return acc
            },
            {} as Record<string, { character: any; loot: LootWithAssigned[] }>
        )
    ).sort((a, b) => a.character.name.localeCompare(b.character.name))

    const copyToClipboard = (text: string, itemId: string) => {
        navigator.clipboard.writeText(text)
        setCopiedItemId(itemId)
        setTimeout(() => setCopiedItemId(null), 2000) // Reset after 2 seconds
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Trade Helper</DialogTitle>
                    <DialogDescription>Select a player to see assigned loot</DialogDescription>
                </DialogHeader>

                {/* Dropdown to select a character */}
                <Select onValueChange={setSelectedCharacterId}>
                    <SelectTrigger className="flex justify-between p-2 border rounded-md">
                        <SelectValue placeholder="Select a player" />
                    </SelectTrigger>
                    <SelectContent className="shadow-md border rounded-md">
                        {lootByCharacter.map(({ character, loot }) => (
                            <SelectItem key={character.id} value={character.id}>
                                {character.name} - {loot.length} item(s)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Display the loot list for the selected character */}
                {selectedCharacterId &&
                    lootByCharacter.find(
                        ({ character }) => character.id === selectedCharacterId
                    ) && (
                        <div className="mt-4">
                            <h3 className="font-semibold">Assigned Loot</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {lootByCharacter
                                    .find(({ character }) => character.id === selectedCharacterId)
                                    ?.loot.map((loot) => (
                                        <div
                                            key={loot.id}
                                            className="flex items-center p-2 border rounded-md shadow-sm  hover:bg-muted transition"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                copyToClipboard(loot.gearItem.item.name, loot.id)
                                            }}
                                        >
                                            <WowGearIcon
                                                item={loot.gearItem}
                                                showTierBanner={true}
                                                showExtendedInfo={true}
                                                iconClassName="rounded-lg h-10 w-10 border border-background"
                                            />
                                            <button className="ml-2 text-gray-500 hover:text-gray-700 flex items-center">
                                                {copiedItemId === loot.id ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    )
}
