import { zodResolver } from '@hookform/resolvers/zod'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { newRaidSessionSchema } from '@shared/schemas/raid.schemas'
import { NewRaidSession } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { WowClassIcon } from './ui/wowclass-icon'

interface NewSessionFormProps {
    onSubmit: (data: NewRaidSession) => void
}

const NewSessionForm: React.FC<NewSessionFormProps> = ({ onSubmit }) => {
    const defaultDate = new Date()
    defaultDate.setHours(21, 0, 0, 0) // Set to 9 PM
    const defaultDateString = defaultDate.toISOString().slice(0, 16).replace('T', ' ')

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
    } = useForm<NewRaidSession>({
        resolver: zodResolver(newRaidSessionSchema),
        defaultValues: {
            name: '',
            roster: [],
            raidDate: defaultDateString
        }
    })

    const onSubmitForm = (formData: NewRaidSession) => {
        onSubmit(formData)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 max-w-2xl mx-auto">
            <div>
                <input
                    {...register('name')}
                    type="text"
                    placeholder="Session Name"
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <input
                    {...register('raidDate')}
                    type="text"
                    placeholder="YYYY-MM-DD HH:mm"
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.raidDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.raidDate.message}</p>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Select Characters:</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <LoaderCircle className="animate-spin text-5xl text-blue-500" />
                    </div>
                ) : (
                    <Controller
                        name="roster"
                        control={control}
                        render={({ field }) => (
                            <div className="">
                                {players.map((player) => (
                                    <div key={player.id} className="bg-gray-800 p-2 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg">
                                                {player.playerName}
                                            </h3>
                                            <div className="flex gap-x-1">
                                                {player.characters?.map((char) => (
                                                    <div
                                                        key={char.id}
                                                        className={`relative cursor-pointer transition-all duration-200 ${
                                                            field.value.includes(char.id)
                                                                ? 'scale-110 ring-2 ring-blue-500 '
                                                                : 'hover:opacity-100 opacity-50 grayscale'
                                                        }`}
                                                        onClick={() => {
                                                            const updatedValue =
                                                                field.value.includes(char.id)
                                                                    ? field.value.filter(
                                                                          (id) => id !== char.id
                                                                      )
                                                                    : [
                                                                          ...field.value.filter(
                                                                              (id) =>
                                                                                  !player.characters?.some(
                                                                                      (c) =>
                                                                                          c.id ===
                                                                                          id
                                                                                  )
                                                                          ),
                                                                          char.id
                                                                      ]
                                                            field.onChange(updatedValue)
                                                        }}
                                                    >
                                                        <WowClassIcon
                                                            wowClassName={char.class}
                                                            className="object-cover object-top rounded-md full h-6 w-6 border border-background"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                )}
                {errors.roster && (
                    <p className="text-red-500 text-sm mt-1">{errors.roster.message}</p>
                )}
            </div>
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
