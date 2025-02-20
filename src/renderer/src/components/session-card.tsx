import { formatUnixTimestampForDisplay } from '@renderer/lib/utils'
import { RaidSessionWithRoster } from '@shared/types/types'
import { Calendar, Users } from 'lucide-react'

type SessionCardProps = {
    session: RaidSessionWithRoster
    className?: string
}

const SessionCard = ({ session, className }: SessionCardProps) => {
    return (
        <div className="bg-muted rounded-lg p-6 mb-2 shadow-lg flex items-center">
            <div
                className={`bg-muted p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors flex-shrink-0 w-64 ${className}`}
            >
                <h3 className="text-xl font-bold mb-2">{session.name}</h3>
                <div className="flex items-center text-gray-400 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatUnixTimestampForDisplay(session.raidDate)}</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{session.roster.length} participants</span>
                </div>
            </div>
        </div>
    )
}

export default SessionCard
