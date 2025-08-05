'use client'

import { cn } from '@renderer/lib/utils'
import { classIcon } from '@renderer/lib/wow-icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CharacterSummary } from 'shared/types/types'

const CharacterTooltip = ({
    item,
    isLowItemLevel
}: {
    item: CharacterSummary
    isLowItemLevel: boolean
}) => (
    <div className="flex flex-col gap-1 p-2 bg-gray-800 rounded text-xs">
        <div className="font-medium text-white">{item.character.name}</div>
        <div className="text-gray-300">{item.character.main ? 'Main' : 'Alt'}</div>
        <div className="text-gray-400">{item.character.realm.replaceAll('-', ' ')}</div>
        <div className={cn('font-medium', isLowItemLevel ? 'text-red-400' : 'text-blue-400')}>
            Item Level: {item.itemLevel}
            {isLowItemLevel && ' (Below Average)'}
        </div>
    </div>
)

export const CharacterOverviewIcon = ({
    charsWithSummary,
    className,
    isLowItemLevel
}: {
    charsWithSummary: CharacterSummary[]
    className?: string
    isLowItemLevel?: (itemLevel: string) => boolean
}): JSX.Element => {
    const navigate = useNavigate()

    // Function to get border color based on item level
    const getBorderColor = (char: CharacterSummary): string => {
        if (char.character.main) {
            return 'border-red-500' // Main characters keep red border
        }

        if (isLowItemLevel && isLowItemLevel(char.itemLevel)) {
            return 'border-orange-500' // Low item level characters get orange border
        }

        return 'border-background' // Default border
    }

    // Function to get item level text color
    const getItemLevelTextColor = (char: CharacterSummary): string => {
        if (isLowItemLevel && isLowItemLevel(char.itemLevel)) {
            return 'text-orange-400' // Low item level gets orange text
        }
        return 'text-foreground' // Default text color
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {charsWithSummary
                .sort((a, b) => (b.character.main ? 1 : 0) - (a.character.main ? 1 : 0)) // main char first
                .map(item => {
                    const isLow = isLowItemLevel ? isLowItemLevel(item.itemLevel) : false
                    return (
                        <div className="-mr-4 relative group" key={item.character.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="cursor-pointer flex flex-col items-center"
                                        onClick={() => navigate(`/roster/${item.character.id}`)}
                                    >
                                        <img
                                            height={50}
                                            width={50}
                                            src={classIcon.get(item.character.class)}
                                            alt={item.character.class}
                                            className={cn(
                                                'object-cover !m-0 !p-0 object-top rounded-full h-12 w-12 border group-hover:scale-105 group-hover:z-30 relative transition duration-500',
                                                getBorderColor(item),
                                                isLow && 'ring-2 ring-orange-300 ring-opacity-50' // Add subtle ring for low item level
                                            )}
                                        />
                                        <div
                                            className={cn(
                                                'text-xs text-center mt-1 font-medium',
                                                getItemLevelTextColor(item)
                                            )}
                                        >
                                            {Math.round(parseInt(item.itemLevel))}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="TooltipContent" sideOffset={5}>
                                    <CharacterTooltip item={item} isLowItemLevel={isLow} />
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )
                })}
        </div>
    )
}
