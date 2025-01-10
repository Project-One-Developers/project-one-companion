import { Checkbox, CheckedState } from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@radix-ui/react-select'
import { LootFilter } from '@renderer/lib/filters'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type FiltersPanelProps = {
    filter: LootFilter
    updateFilter: (key: string, value: any) => void
}

export const FiltersPanel = ({ filter: filter, updateFilter }: FiltersPanelProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible.Root
            className="bg-gray-800 text-white p-6 rounded-lg"
            defaultOpen={false}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            {/* Panel Header */}
            <Collapsible.Trigger className="flex items-center justify-between w-full text-lg font-bold mb-2 cursor-pointer">
                Filters
                <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </Collapsible.Trigger>

            {/* Panel Content */}
            <Collapsible.Content className="mt-4 space-y-4">
                {/* Raid Difficulty Selector */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="raid-diff" className="text-sm font-semibold">
                        Raid Difficulty:
                    </label>
                    <Select
                        value={filter.raidDiff}
                        onValueChange={(value) => updateFilter('raidDiff', value)}
                    >
                        <SelectTrigger
                            id="raid-diff"
                            className="border rounded-md p-2 bg-gray-700 text-white flex items-center justify-between"
                        >
                            <span>{filter.raidDiff || 'Select'}</span>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border border-gray-600 rounded-md">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Heroic">Heroic</SelectItem>
                            <SelectItem value="Mythic">Mythic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Checkbox Filters */}
                {[
                    { id: 'only-latest', label: 'Latest only', key: 'onlyLatest' },
                    { id: 'current-week', label: 'Current Reset', key: 'currentWeek' }
                ].map(({ id, label, key }) => (
                    <div key={id} className="flex items-center gap-3">
                        <Checkbox
                            id={id}
                            checked={filter[key as keyof typeof filter] as CheckedState}
                            onCheckedChange={(checked) => updateFilter(key, !!checked)}
                            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                        >
                            {filter[key as keyof typeof filter] && (
                                <Check className="text-white w-4 h-4" />
                            )}
                        </Checkbox>
                        <label htmlFor={id} className="text-sm font-semibold">
                            {label}
                        </label>
                    </div>
                ))}

                {/* Upgrades only and Minimum Upgrade Amount in the same row */}
                <div className="flex flex-row items-center gap-3">
                    <Checkbox
                        id="only-upgrades"
                        checked={filter.onlyUpgrades as CheckedState}
                        onCheckedChange={(checked) => updateFilter('onlyUpgrades', !!checked)}
                        className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                    >
                        {filter.onlyUpgrades && <Check className="text-white w-4 h-4" />}
                    </Checkbox>
                    <label htmlFor="only-upgrades" className="text-sm font-semibold">
                        Minimum upgrade
                    </label>
                    <input
                        id="upgrade-amount"
                        type="number"
                        min="0"
                        step="500"
                        value={filter.minUpgrade}
                        onChange={(e) => updateFilter('minUpgrade', Number(e.target.value))}
                        disabled={!filter.onlyUpgrades}
                        className={`border rounded-md p-2 bg-gray-700 text-white w-20 ${!filter.onlyUpgrades ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </Collapsible.Content>
        </Collapsible.Root>
    )
}
