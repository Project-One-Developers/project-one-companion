import { zodResolver } from '@hookform/resolvers/zod'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { formatUnixTimestampForDisplay, parseStringToUnixTimestamp } from '@renderer/lib/utils'
import { newRaidSessionSchema } from '@shared/schemas/raid.schemas'
import { NewRaidSession, Player, RaidSession } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { WowClassIcon } from './ui/wowclass-icon'

interface PlayerWithCharsRowProps {
    player: Player
    selectedCharacters: string[]
    onCharacterToggle: (charId: string) => void
}

const PlayerWithCharsRow: React.FC<PlayerWithCharsRowProps> = ({
    player,
    selectedCharacters,
    onCharacterToggle
}) => (
    <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{player.name}</h3>
        <div className="flex gap-x-1">
            {player.characters?.map((char) => (
                <WowClassIcon
                    key={char.id}
                    wowClassName={char.class}
                    className={`object-cover object-top rounded-md h-6 w-6 border border-background cursor-pointer transition-all duration-200 ${
                        selectedCharacters.includes(char.id)
                            ? 'scale-110 ring-2 ring-blue-500'
                            : 'hover:opacity-100 opacity-50 grayscale'
                    }`}
                    onClick={() => onCharacterToggle(char.id)}
                />
            ))}
        </div>
    </div>
)

const updatedNewRaidSessionSchema = newRaidSessionSchema.extend({
    raidDate: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), {
        message: 'Invalid date format. Use DD/MM/YYYY HH:mm'
    })
})

type FormNewRaidSession = z.infer<typeof updatedNewRaidSessionSchema>

const SessionForm: React.FC<{
    onSubmit: (data: NewRaidSession) => void
    existingSession?: RaidSession
}> = ({ onSubmit, existingSession }) => {
    const defaultDate = new Date()
    defaultDate.setHours(21, 0, 0, 0)

    const { data: players = [], isLoading } = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })

    const [tankPlayers, healerPlayers, dpsPlayers] = ['Tank', 'Healer', 'DPS'].map((role) =>
        players.filter(
            (p) => p.characters && p.characters.length > 0 && p.characters[0].role === role
        )
    )

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<FormNewRaidSession>({
        resolver: zodResolver(updatedNewRaidSessionSchema),
        defaultValues: existingSession
            ? {
                  name: existingSession.name,
                  roster: existingSession.roster.map((r) => r.id),
                  raidDate: formatUnixTimestampForDisplay(existingSession.raidDate)
              }
            : {
                  name: '',
                  roster: [],
                  raidDate: formatUnixTimestampForDisplay(Math.floor(defaultDate.getTime() / 1000))
              }
    })

    const onSubmitForm = (formData: FormNewRaidSession) => {
        onSubmit({
            ...formData,
            raidDate: parseStringToUnixTimestamp(formData.raidDate)
        })
        if (!existingSession) reset()
    }

    const toggleCharacter = (
        currentRoster: Set<string>,
        player: Player,
        charId: string
    ): string[] => {
        const playerCharIds = new Set(player.characters?.map((c) => c.id) || [])
        if (currentRoster.has(charId)) {
            currentRoster.delete(charId)
        } else {
            playerCharIds.forEach((id) => currentRoster.delete(id))
            currentRoster.add(charId)
        }
        return Array.from(currentRoster)
    }

    if (isLoading) {
        return <LoaderCircle className="animate-spin text-5xl mx-auto mt-10 mb-10" />
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-6xl mx-auto space-y-6">
            <div className="flex space-x-4">
                {['name', 'raidDate'].map((field) => (
                    <div key={field} className="flex-1">
                        <input
                            {...register(field as 'name' | 'raidDate')}
                            type="text"
                            placeholder={field === 'name' ? 'Session Name' : 'DD/MM/YYYY HH:mm'}
                            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        {errors[field as 'name' | 'raidDate'] && (
                            <p className="text-red-500 text-sm">
                                {errors[field as 'name' | 'raidDate']?.message}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                    name="roster"
                    control={control}
                    render={({ field }) => (
                        <>
                            <div className="space-y-2 overflow-y-auto p-1">
                                {tankPlayers.map((player) => (
                                    <PlayerWithCharsRow
                                        key={player.id}
                                        player={player}
                                        selectedCharacters={field.value}
                                        onCharacterToggle={(charId) => {
                                            const currentRoster = new Set(field.value)
                                            field.onChange(
                                                toggleCharacter(currentRoster, player, charId)
                                            )
                                        }}
                                    />
                                ))}
                                <hr className="border-gray-800" />
                                {healerPlayers.map((player) => (
                                    <PlayerWithCharsRow
                                        key={player.id}
                                        player={player}
                                        selectedCharacters={field.value}
                                        onCharacterToggle={(charId) => {
                                            const currentRoster = new Set(field.value)
                                            field.onChange(
                                                toggleCharacter(currentRoster, player, charId)
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="space-y-2 overflow-y-auto p-1">
                                {dpsPlayers.map((player) => (
                                    <PlayerWithCharsRow
                                        key={player.id}
                                        player={player}
                                        selectedCharacters={field.value}
                                        onCharacterToggle={(charId) => {
                                            const currentRoster = new Set(field.value)
                                            field.onChange(
                                                toggleCharacter(currentRoster, player, charId)
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                />
            </div>

            {errors.roster && <p className="text-red-500 text-sm">{errors.roster.message}</p>}

            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
                Confirm
            </button>
        </form>
    )
}

export default SessionForm
