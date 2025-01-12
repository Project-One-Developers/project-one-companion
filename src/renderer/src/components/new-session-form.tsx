import { zodResolver } from '@hookform/resolvers/zod'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { newRaidSessionSchema } from '@shared/schemas/raid.schemas'
import { Character, NewRaidSession, Player } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Controller, FieldErrors, useForm, UseFormRegister } from 'react-hook-form'
import { z } from 'zod'
import { WowClassIcon } from './ui/wowclass-icon'

// Helper functions for date conversion
const formatDateForDisplay = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const parseDateToTimestamp = (dateString: string): number => {
    const [datePart, timePart] = dateString.split(' ')
    const [day, month, year] = datePart.split('/').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    const date = new Date(year, month - 1, day, hours, minutes)
    return Math.floor(date.getTime() / 1000)
}

// Updated schema
const updatedNewRaidSessionSchema = newRaidSessionSchema.extend({
    raidDate: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), {
        message: 'Invalid date format. Use DD/MM/YYYY HH:mm'
    })
})

type FormNewRaidSession = z.infer<typeof updatedNewRaidSessionSchema>

interface NewSessionFormProps {
    onSubmit: (data: NewRaidSession) => void
}

interface FormInputProps {
    register: UseFormRegister<FormNewRaidSession>
    name: 'name' | 'raidDate'
    placeholder: string
    errors: FieldErrors<FormNewRaidSession>
}

const FormInput: React.FC<FormInputProps> = ({ register, name, placeholder, errors }) => (
    <div className="mb-4">
        <input
            {...register(name)}
            type="text"
            placeholder={placeholder}
            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <div className="h-5">
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
        </div>
    </div>
)

interface CharacterIconProps {
    character: Character
    isSelected: boolean
    onClick: () => void
}

const CharacterIcon: React.FC<CharacterIconProps> = ({ character, isSelected, onClick }) => (
    <WowClassIcon
        wowClassName={character.class}
        className={`object-cover object-top rounded-md h-6 w-6 border border-background cursor-pointer transition-all duration-200 ${
            isSelected ? 'scale-110 ring-2 ring-blue-500' : 'hover:opacity-100 opacity-50 grayscale'
        }`}
        onClick={onClick}
    />
)

interface PlayerRowProps {
    player: Player
    selectedCharacters: string[]
    onCharacterToggle: (charId: string) => void
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, selectedCharacters, onCharacterToggle }) => (
    <div className="bg-gray-800 p-2 rounded-lg flex items-center justify-between">
        <h3 className="font-bold text-lg">{player.playerName}</h3>
        <div className="flex gap-x-1">
            {player.characters?.map((char) => (
                <CharacterIcon
                    key={char.id}
                    character={char}
                    isSelected={selectedCharacters.includes(char.id)}
                    onClick={() => onCharacterToggle(char.id)}
                />
            ))}
        </div>
    </div>
)

const NewSessionForm: React.FC<NewSessionFormProps> = ({ onSubmit }) => {
    const defaultDate = new Date()
    defaultDate.setHours(21, 0, 0, 0) // Set to 9 PM
    const defaultDateString = formatDateForDisplay(Math.floor(defaultDate.getTime() / 1000))

    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })

    const players = data?.players ?? []

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<FormNewRaidSession>({
        resolver: zodResolver(updatedNewRaidSessionSchema),
        defaultValues: {
            name: '',
            roster: [],
            raidDate: defaultDateString
        }
    })

    const onSubmitForm = (formData: FormNewRaidSession) => {
        const submissionData: NewRaidSession = {
            ...formData,
            raidDate: parseDateToTimestamp(formData.raidDate)
        }
        onSubmit(submissionData)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2 max-w-2xl mx-auto">
            <FormInput register={register} name="name" placeholder="Session Name" errors={errors} />
            <FormInput
                register={register}
                name="raidDate"
                placeholder="DD/MM/YYYY HH:mm"
                errors={errors}
            />
            <h2 className="text-xl font-bold mb-4">Select Characters:</h2>
            {isLoading ? (
                <LoaderCircle className="animate-spin text-5xl text-blue-500 mx-auto" />
            ) : (
                <Controller
                    name="roster"
                    control={control}
                    render={({ field }) => (
                        <>
                            {players.map((player) => (
                                <PlayerRow
                                    key={player.id}
                                    player={player}
                                    selectedCharacters={field.value}
                                    onCharacterToggle={(charId) => {
                                        const currentRoster = new Set(field.value)
                                        const playerCharIds = new Set(
                                            player.characters?.map((c) => c.id) || []
                                        )

                                        if (currentRoster.has(charId)) {
                                            currentRoster.delete(charId)
                                        } else {
                                            playerCharIds.forEach((id) => currentRoster.delete(id))
                                            currentRoster.add(charId)
                                        }

                                        field.onChange(Array.from(currentRoster))
                                    }}
                                />
                            ))}
                        </>
                    )}
                />
            )}
            {errors.roster && <p className="text-red-500 text-sm mt-1">{errors.roster.message}</p>}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
                Create New Session
            </button>
        </form>
    )
}

export default NewSessionForm
