'use client'

import { cn } from '@renderer/lib/utils'
import { classIcon } from '@renderer/lib/wow-icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CharacterSummary } from 'shared/types/types'

const CharacterTooltip = ({ item }: { item: CharacterSummary }) => (
    <div className="flex flex-col gap-1 p-2 bg-gray-800 rounded text-xs">
        <div className="font-medium text-white">{item.character.name}</div>
        <div className="text-gray-300">{item.character.main ? 'Main' : 'Alt'}</div>
        <div className="text-gray-400">{item.character.realm.replaceAll('-', ' ')}</div>
        <div className="text-blue-400">Item Level: {item.itemLevel}</div>
    </div>
)

export const CharacterOverviewIcon = ({
    items,
    className
}: {
    items: CharacterSummary[]
    className?: string
}): JSX.Element => {
    const navigate = useNavigate()

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {items
                .sort((a, b) => (b.character.main ? 1 : 0) - (a.character.main ? 1 : 0)) // main char first
                .map(item => (
                    <div className="-mr-4 relative group" key={item.character.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/roster/${item.character.id}`)}
                                >
                                    <img
                                        height={50}
                                        width={50}
                                        src={classIcon.get(item.character.class)}
                                        alt={item.character.class}
                                        className={cn(
                                            'object-cover !m-0 !p-0 object-top rounded-full h-12 w-12 border group-hover:scale-105 group-hover:z-30 relative transition duration-500',
                                            item.character.main
                                                ? 'border-red-500'
                                                : 'border-background'
                                        )}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="TooltipContent" sideOffset={5}>
                                <CharacterTooltip item={item} />
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ))}
        </div>
    )
}
