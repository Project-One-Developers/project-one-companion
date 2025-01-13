import { zodResolver } from '@hookform/resolvers/zod'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { formatUnixTimestampForDisplay, parseStringToUnixTimestamp } from '@renderer/lib/utils'
import { newRaidSessionSchema } from '@shared/schemas/raid.schemas'
import { Character, NewRaidSession, Player } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Controller, FieldErrors, useForm, UseFormRegister } from 'react-hook-form'
import { z } from 'zod'
import { WowClassIcon } from './ui/wowclass-icon'

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
    <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{player.name}</h3>
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
    const defaultDateString = formatUnixTimestampForDisplay(
        Math.floor(defaultDate.getTime() / 1000)
    )

    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })

    const players = data ?? []

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
            raidDate: parseStringToUnixTimestamp(formData.raidDate)
        }
        onSubmit(submissionData)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Session Details</h2>
                    <FormInput
                        register={register}
                        name="name"
                        placeholder="Session Name"
                        errors={errors}
                    />
                    <FormInput
                        register={register}
                        name="raidDate"
                        placeholder="DD/MM/YYYY HH:mm"
                        errors={errors}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Select Characters</h2>
                    {isLoading ? (
                        <LoaderCircle className="animate-spin text-5xl text-blue-500 mx-auto" />
                    ) : (
                        <div className="max-h-64 overflow-y-auto pr-2">
                            <Controller
                                name="roster"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
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
                                                        playerCharIds.forEach((id) =>
                                                            currentRoster.delete(id)
                                                        )
                                                        currentRoster.add(charId)
                                                    }

                                                    field.onChange(Array.from(currentRoster))
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            />
                        </div>
                    )}
                    {errors.roster && (
                        <p className="text-red-500 text-sm">{errors.roster.message}</p>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold mt-6"
            >
                Create New Session
            </button>
        </form>
    )
}

export default NewSessionForm
