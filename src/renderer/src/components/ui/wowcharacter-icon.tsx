import { Character } from '@shared/types/types'
import React from 'react'
import { WowClassIcon } from './wowclass-icon'
import { useNavigate } from 'react-router'

export interface WowCharacterIconProps {
    character: Character
    className?: string
    showTooltip?: boolean
    showMainIndicator?: boolean
    showName?: boolean
    truncateAfter?: number
    size?: 'sm' | 'md' | 'lg'
    showRoleBadges?: boolean
    onClick?: () => void
}

export const WowCharacterIcon: React.FC<WowCharacterIconProps> = ({
    character,
    className = '',
    showTooltip = false,
    showMainIndicator = true,
    showName = true,
    truncateAfter = 4,
    size = 'md',
    showRoleBadges = false,
    onClick
}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClick) {
            onClick()
        } else {
            navigate(`/roster/${character.id}`)
        }
    }

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

    const roleBadgeSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    const roleBadgeIconSizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    }

    // Determine if character should show role badges
    const showHealerBadge = showRoleBadges && character.role === 'Healer'
    const showTankBadge = showRoleBadges && character.role === 'Tank'

    return (
        <div
            className={`flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110 ${className}`}
            onClick={handleClick}
        >
            {showName && (
                <div>
                    <p className={`${textSizeClasses[size]} mb-2`}>
                        {character.name.slice(0, truncateAfter)}
                    </p>
                </div>
            )}
            <div className="relative inline-block">
                <WowClassIcon
                    wowClassName={character.class}
                    charname={character.name}
                    showTooltip={showTooltip}
                    className={`${sizeClasses[size]} border-2 border-background rounded-lg`}
                />
                {showHealerBadge && (
                    <div
                        className={`absolute -top-1 -left-1 ${roleBadgeSizeClasses[size]} bg-yellow-500 rounded-sm flex items-center justify-center`}
                    >
                        <svg
                            className={`${roleBadgeIconSizeClasses[size]} text-yellow-900`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 2a1.5 1.5 0 011.5 1.5v4h4a1.5 1.5 0 110 3h-4v4a1.5 1.5 0 11-3 0v-4h-4a1.5 1.5 0 110-3h4v-4A1.5 1.5 0 0110 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
                {showTankBadge && (
                    <div
                        className={`absolute -top-1 -left-1 ${roleBadgeSizeClasses[size]} bg-yellow-500 rounded-sm flex items-center justify-center`}
                    >
                        <svg
                            className={`${roleBadgeIconSizeClasses[size]} text-yellow-900`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </div>
            {showMainIndicator && character.main ? (
                <div className={`${mainIndicatorSizeClasses[size]} bg-white rounded-lg mt-2`} />
            ) : null}
        </div>
    )
}
