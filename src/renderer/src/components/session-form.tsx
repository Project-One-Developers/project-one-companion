import { zodResolver } from '@hookform/resolvers/zod'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import {
    formatUnixTimestampForDisplay,
    parseStringToUnixTimestamp
} from '@shared/libs/date/date-utils'
import { newRaidSessionSchema } from '@shared/schemas/raid.schemas'
import { NewRaidSession, PlayerWithCharacters, RaidSessionWithRoster } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import {
    Ban,
    Brain,
    Dumbbell,
    LoaderCircle,
    Radiation,
    ShieldCheck,
    Swords,
    Users
} from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { WowClassIcon } from './ui/wowclass-icon'

interface PlayerWithCharsRowProps {
    player: PlayerWithCharacters
    selectedCharacters: string[]
    onCharacterToggle: (charId: string) => void
}

const PlayerWithCharsRow: React.FC<PlayerWithCharsRowProps> = ({
    player,
    selectedCharacters,
    onCharacterToggle
}) => {
    const noneSelected = player.characters.every((char) => !selectedCharacters.includes(char.id))
    return (
        <div className="flex items-center justify-between">
            <h3 className={clsx('font-bold ', noneSelected ? 'text-gray-800' : 'text-white')}>
                {player.name}
            </h3>
            <div className="flex gap-x-1">
                {player.characters?.map((char) => (
                    <div key={char.id} onClick={() => onCharacterToggle(char.id)}>
                        <WowClassIcon
                            wowClassName={char.class}
                            //charname={char.name}
                            className={clsx(
                                'object-cover object-top rounded-md h-5 w-5 border border-background cursor-pointer transition-all duration-200',
                                selectedCharacters.includes(char.id)
                                    ? 'scale-110 ring-2 ring-blue-500'
                                    : 'hover:opacity-100 opacity-50 grayscale'
                            )}
                        />
                        {char.main ? (
                            <div className="h-[1px] w-5 bg-white rounded-lg mt-2" />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

const hasClass = (
    roster: string[],
    className: string,
    availablePlayers: PlayerWithCharacters[]
): boolean => {
    // Check if any selected character belongs to the specified class
    return roster.some((charId) => {
        const character = availablePlayers.flatMap((p) => p.characters).find((c) => c.id === charId)
        return character?.class === className
    })
}

const calculateImmunities = (
    roster: string[],
    availablePlayers: PlayerWithCharacters[]
): { name: string; count: number }[] => {
    // Map classes to their respective immunities
    const classImmunities: Record<string, string[]> = {
        Hunter: ['Aspect of the Turtle'],
        Mage: ['Ice Block'],
        Paladin: ['Divine Shield'],
        'Paladin (Protection)': ['Blessing of Spellwarding'],
        Rogue: ['Cloak of Shadows']
    }

    // Object to store immunity counts
    const immunityCounts: Record<string, number> = {}

    // Iterate through selected characters and count their immunities
    roster.forEach((charId) => {
        const character = availablePlayers.flatMap((p) => p.characters).find((c) => c.id === charId)
        if (character?.class && classImmunities[character.class]) {
            classImmunities[character.class].forEach((immunity) => {
                immunityCounts[immunity] = (immunityCounts[immunity] || 0) + 1
            })
        }
    })

    // Convert the immunity counts object into an array of objects
    return Object.entries(immunityCounts).map(([name, count]) => ({ name, count }))
}

const RaidOverview: React.FC<{ roster: string[]; availablePlayers: PlayerWithCharacters[] }> = ({
    roster,
    availablePlayers
}) => {
    const buffs = [
        { label: 'Attack Power', icon: <Dumbbell />, class: 'Warrior' },
        { label: 'Stamina', icon: <ShieldCheck />, class: 'Priest' },
        { label: 'Intellect', icon: <Brain />, class: 'Mage' },
        { label: 'Chaos Brand', icon: <Radiation />, class: 'Demon Hunter' },
        { label: 'Mystic Touch', icon: <Swords />, class: 'Monk' }
    ]

    const immunities = calculateImmunities(roster, availablePlayers)

    return (
        <div className="p-4  rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> {roster.length} Players
            </h3>
            <div className="flex flex-col space-y-2 mt-2">
                {/* Buffs Section */}
                {buffs.map(({ label, icon, class: className }) => {
                    const hasBuff = hasClass(roster, className, availablePlayers)
                    return (
                        <div
                            key={label}
                            className={`flex items-center gap-2 ${
                                hasBuff ? 'text-white' : 'text-gray-500 opacity-50'
                            }`}
                        >
                            {icon} {label}
                        </div>
                    )
                })}
            </div>
            {/* Immunities Section */}
            <div className="mt-8">
                <h4 className="text-white font-semibold flex items-center gap-2">
                    <Ban className="w-5 h-5 text-red-500" /> Immunities
                </h4>
                {immunities.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-300 mt-1">
                        {immunities.map(({ name, count }) => (
                            <li key={name}>
                                {name} <span className="text-gray-400">({count})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 opacity-50">None</p>
                )}
            </div>
        </div>
    )
}

const updatedNewRaidSessionSchema = newRaidSessionSchema.extend({
    raidDate: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), {
        message: 'Invalid date format. Use DD/MM/YYYY HH:mm'
    })
})

type FormNewRaidSession = z.infer<typeof updatedNewRaidSessionSchema>

const SessionForm: React.FC<{
    onSubmit: (data: NewRaidSession) => void
    existingSession?: RaidSessionWithRoster
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
        player: PlayerWithCharacters,
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
        <form onSubmit={handleSubmit(onSubmitForm)} className="w-full mx-auto space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                {healerPlayers
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((player) => (
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
                                {dpsPlayers
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((player) => (
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
                            {/* Raid Overview */}
                            <RaidOverview roster={field.value} availablePlayers={players} />
                            {/* <div className="space-y-2 overflow-y-auto p-1">
                                <h3 className="text-white font-bold">Raid Overview</h3>
                                <p className="text-gray-300">
                                    Roster: {field.value.length} players
                                </p>
                                <p className="text-gray-300">
                                    Attack Power: {hasClass(field.value, 'Warrior') ? 'Yes' : 'No'}
                                </p>
                                <p className="text-gray-300">
                                    Stamina: {hasClass(field.value, 'Priest') ? 'Yes' : 'No'}
                                </p>
                                <p className="text-gray-300">
                                    Intellect: {hasClass(field.value, 'Mage') ? 'Yes' : 'No'}
                                </p>
                                <p className="text-gray-300">
                                    Chaos Brand:{' '}
                                    {hasClass(field.value, 'Demon Hunter') ? 'Yes' : 'No'}
                                </p>
                                <p className="text-gray-300">
                                    Mystic Touch: {hasClass(field.value, 'Monk') ? 'Yes' : 'No'}
                                </p>
                                <p className="text-gray-300">
                                    Immunities: {calculateImmunities(field.value)}
                                </p>
                            </div> */}
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
