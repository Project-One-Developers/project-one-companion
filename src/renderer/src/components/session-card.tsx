import { formatUnixTimestampForDisplay, unixTimestampToWowWeek } from '@shared/libs/date/date-utils'
import { RaidSessionWithSummary } from '@shared/types/types'
import { Calendar, ExternalLink, Gem, Package, Users } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

type SessionCardProps = {
    session: RaidSessionWithSummary
    className?: string
    showActions?: boolean
    onClick?: () => void
    onEditRoster?: (sessionId: string) => void
    onLootImport?: (sessionId: string) => void
}

const SessionCard = ({
    session,
    className,
    showActions = false,
    onClick,
    onEditRoster,
    onLootImport
}: SessionCardProps) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        if (onClick) {
            onClick()
        }
    }

    const handleGoToSession = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigate(`/raid-session/${session.id}`)
    }

    const handleEditRoster = (e: React.MouseEvent) => {
        e.stopPropagation()
        onEditRoster?.(session.id)
    }

    const handleLootImport = (e: React.MouseEvent) => {
        e.stopPropagation()
        onLootImport?.(session.id)
    }

    return (
        <div
            className={cn(
                `bg-muted rounded-lg border border-gray-900 cursor-pointer hover:bg-gray-700 transition-colors min-w-64 relative flex flex-col`,
                className
            )}
            onClick={handleCardClick}
        >
            {/* Main content area */}
            <div className="p-4 flex-1">
                <h3 className="text-xl font-bold truncate max-w-[220px] mb-2">{session.name}</h3>
                <div className="flex items-center text-gray-400 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                        {formatUnixTimestampForDisplay(session.raidDate)} -{' '}
                        {unixTimestampToWowWeek(session.raidDate)}
                    </span>
                </div>
                <div className="flex items-center text-gray-400 mb-1">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{session.rosterCount} participants</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <Gem className="w-4 h-4 mr-2" />
                    <span>{session.lootCount} loots</span>
                </div>
            </div>

            {/* Bottom actions bar */}
            {showActions && (
                <div className="border-t border-gray-600 px-4 py-2 bg-gray-800/50 rounded-b-lg">
                    <div className="flex justify-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 hover:bg-gray-600 flex-1"
                            onClick={handleGoToSession}
                            title="Go to session page"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 hover:bg-gray-600 flex-1"
                            onClick={handleEditRoster}
                            title="Edit roster"
                        >
                            <Users className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 hover:bg-gray-600 flex-1"
                            onClick={handleLootImport}
                            title="Loot import"
                        >
                            <Package className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SessionCard
