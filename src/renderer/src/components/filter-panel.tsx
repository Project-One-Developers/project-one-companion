import { Checkbox, CheckedState } from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

type FiltersPanelProps = {
    filters: {
        raidDiff: string
        onlyLatest: boolean
        currentWeek: boolean
        onlyUpgrades: boolean
    }
    updateFilter: (key: string, value: any) => void
}

export const FiltersPanel = ({ filters, updateFilter }: FiltersPanelProps) => {
    return (
        <Collapsible.Root className="bg-gray-800 text-white p-6 rounded-lg" defaultOpen={false}>
            {/* Panel Header */}
            <Collapsible.Trigger className="flex items-center justify-between w-full text-lg font-bold mb-2 cursor-pointer">
                Filters
                <ChevronDown className="w-5 h-5 transition-transform duration-200" />
            </Collapsible.Trigger>

            {/* Panel Content */}
            <Collapsible.Content className="mt-4 space-y-4">
                {/* Raid Difficulty Selector */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="raid-diff" className="text-sm font-semibold">
                        Raid Difficulty:
                    </label>
                    <Select
                        value={filters.raidDiff}
                        onValueChange={(value) => updateFilter('raidDiff', value)}
                    >
                        <SelectTrigger
                            id="raid-diff"
                            className="border rounded-md p-2 bg-gray-700 text-white flex items-center justify-between"
                        >
                            <span>{filters.raidDiff || 'Select'}</span>
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
                    { id: 'current-week', label: 'Current Reset', key: 'currentWeek' },
                    { id: 'only-upgrades', label: 'Upgrades only', key: 'onlyUpgrades' }
                ].map(({ id, label, key }) => (
                    <div key={id} className="flex items-center gap-3">
                        <Checkbox
                            id={id}
                            checked={filters[key as keyof typeof filters] as CheckedState}
                            onCheckedChange={(checked) => updateFilter(key, !!checked)}
                            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                        >
                            {filters[key as keyof typeof filters] && (
                                <Check className="text-white w-4 h-4" />
                            )}
                        </Checkbox>
                        <label htmlFor={id} className="text-sm font-semibold">
                            {label}
                        </label>
                    </div>
                ))}
            </Collapsible.Content>
        </Collapsible.Root>
    )
}
