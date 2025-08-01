import { Character } from '@shared/types/types'
import React from 'react'
import { WowClassIcon } from './wowclass-icon'

export interface WowCharacterIconProps {
    character: Character
    className?: string
    showTooltip?: boolean
    showMainIndicator?: boolean
    showName?: boolean
    truncateAfter?: number
    size?: 'sm' | 'md' | 'lg'
}

export const WowCharacterIcon: React.FC<WowCharacterIconProps> = ({
    character,
    className = '',
    showTooltip = false,
    showMainIndicator = true,
    showName = true,
    truncateAfter = 4,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10'
    }

    const textSizeClasses = {
        sm: 'text-[8px]',
        md: 'text-[9px]',
        lg: 'text-[10px]'
    }

    const mainIndicatorSizeClasses = {
        sm: 'h-[1px] w-4',
        md: 'h-[2px] w-6',
        lg: 'h-[3px] w-8'
    }

    return (
        <div
            className={`flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110 ${className}`}
        >
            {showName && (
                <div>
                    <p className={`${textSizeClasses[size]} mb-2`}>
                        {character.name.slice(0, truncateAfter)}
                    </p>
                </div>
            )}
            <WowClassIcon
                wowClassName={character.class}
                charname={showTooltip ? character.name : undefined}
                className={`${sizeClasses[size]} border-2 border-background rounded-lg`}
            />
            {showMainIndicator && character.main ? (
                <div className={`${mainIndicatorSizeClasses[size]} bg-white rounded-lg mt-2`} />
            ) : null}
        </div>
    )
}
