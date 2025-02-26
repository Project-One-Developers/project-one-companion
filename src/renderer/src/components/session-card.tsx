import { formatUnixTimestampForDisplay } from '@shared/libs/date/date-utils'
import { RaidSessionWithSummary } from '@shared/types/types'
import { Calendar, Gem, Users } from 'lucide-react'

type SessionCardProps = {
    session: RaidSessionWithSummary
    className?: string
}

const SessionCard = ({ session, className }: SessionCardProps) => {
    return (
        <div
            className={`bg-muted p-4 rounded-lg cursor-pointer gap-1 hover:bg-gray-700 transition-colors flex-shrink-0 w-64 ${className}`}
        >
            <h3 className="text-xl font-bold mb-2">{session.name}</h3>
            <div className="flex items-center text-gray-400 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatUnixTimestampForDisplay(session.raidDate)}</span>
            </div>
            <div className="flex items-center text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                <span>{session.rosterCount} participants</span>
            </div>
            <div className="flex items-center text-gray-400">
                <Gem className="w-4 h-4 mr-2" />
                <span>{session.lootCount} loots</span>
            </div>
        </div>
    )
}

export default SessionCard
