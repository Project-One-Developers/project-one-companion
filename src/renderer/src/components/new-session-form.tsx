import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import React, { useState } from 'react'

// Mock data for characters (you might want to move this to a separate file or fetch from an API)
const mockCharacters = [
    { id: 1, name: 'Thrall', class: 'Shaman' },
    { id: 2, name: 'Jaina', class: 'Mage' },
    { id: 3, name: 'Illidan', class: 'Demon Hunter' }
]

interface NewSessionFormProps {
    onSubmit: (name: string, characters: number[]) => void
}

const NewSessionForm: React.FC<NewSessionFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('')
    const [selectedCharacters, setSelectedCharacters] = useState<number[]>([])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(name, selectedCharacters)
        setName('')
        setSelectedCharacters([])
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Session Name"
                className="w-full p-2 bg-gray-700 rounded"
                required
            />
            <div>
                <p className="mb-2">Select Characters:</p>
                {mockCharacters.map((char) => (
                    <div key={char.id} className="flex items-center mb-2">
                        <Checkbox.Root
                            className="flex h-4 w-4 items-center justify-center rounded bg-gray-700 mr-2"
                            checked={selectedCharacters.includes(char.id)}
                            onCheckedChange={(checked) => {
                                setSelectedCharacters((prev) =>
                                    checked
                                        ? [...prev, char.id]
                                        : prev.filter((id) => id !== char.id)
                                )
                            }}
                        >
                            <Checkbox.Indicator>
                                <CheckIcon className="h-4 w-4 text-blue-500" />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label>
                            {char.name} - {char.class}
                        </label>
                    </div>
                ))}
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
                Create New Session
            </button>
        </form>
    )
}

export default NewSessionForm
