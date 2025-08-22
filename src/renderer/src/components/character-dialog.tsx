import { CheckedState } from '@radix-ui/react-checkbox'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addCharacter, editCharacter } from '@renderer/lib/tanstack-query/players'
import { REALMS, ROLES } from '@shared/consts/wow.consts'
import { ROLES_CLASSES_MAP } from '@shared/schemas/wow.schemas'
import type { Character, NewCharacter, Player, WowClassName, WoWRole } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React, { useState, useEffect, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type CharacterDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    mode: 'add' | 'edit'
    player?: Player
    existingCharacter?: Character
}

type FormData = {
    name: string
    realm: string
    class: WowClassName
    role: WoWRole
    main: boolean
}

type FormErrors = {
    name?: string
    realm?: string
    class?: string
    role?: string
}

export default function CharacterDialog({
    isOpen,
    setOpen,
    mode,
    player,
    existingCharacter
}: CharacterDialogProps): JSX.Element {
    if (mode === 'edit' && !existingCharacter) {
        throw new Error('Cannot edit a character that does not exist')
    }
    if (mode === 'add' && !player) {
        throw new Error('Cannot add a character without a player')
    }

    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        realm: 'pozzo-delleternità',
        class: 'Death Knight',
        role: 'DPS',
        main: false
    })

    const [errors, setErrors] = useState<FormErrors>({})

    // Initialize form data when dialog opens or mode/character changes
    useEffect(() => {
        if (mode === 'edit' && existingCharacter) {
            setFormData({
                name: existingCharacter.name,
                realm: existingCharacter.realm,
                class: existingCharacter.class,
                role: existingCharacter.role,
                main: existingCharacter.main
            })
        } else {
            setFormData({
                name: '',
                realm: 'pozzo-delleternità',
                class: 'Death Knight',
                role: 'DPS',
                main: false
            })
        }
        setErrors({})
    }, [mode, existingCharacter, isOpen])

    const addMutation = useMutation({
        mutationFn: addCharacter,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.charactersSummary] })
            resetForm()
            setOpen(false)
            toast({
                title: 'Character Added',
                description: `The character ${arg.name} has been successfully added.`
            })
        },
        onError: error => {
            toast({
                title: 'Error',
                description: `Unable to add the character. Error: ${error.message}`
            })
        }
    })

    const editMutation = useMutation({
        mutationFn: editCharacter,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.character, arg.id]
            })
            queryClient.invalidateQueries({ queryKey: [queryKeys.charactersSummary] })
            setOpen(false)
            toast({
                title: 'Character edited',
                description: `Character ${arg.name} edited successfully`
            })
        },
        onError: error => {
            toast({
                title: 'Error',
                description: `Unable to edit the character. Error: ${error.message}`
            })
        }
    })

    const resetForm = () => {
        setFormData({
            name: '',
            realm: 'pozzo-delleternità',
            class: 'Death Knight',
            role: 'DPS',
            main: false
        })
        setErrors({})
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.realm.trim()) {
            newErrors.realm = 'Realm is required'
        }

        if (!formData.class.trim()) {
            newErrors.class = 'Class is required'
        }

        if (!formData.role.trim()) {
            newErrors.role = 'Role is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const characterData: NewCharacter = {
            ...formData,
            playerId: player?.id || existingCharacter?.playerId || ''
        }

        if (mode === 'edit' && existingCharacter) {
            editMutation.mutate({ id: existingCharacter.id, ...characterData })
        } else {
            if (!player) {
                throw Error('Unable to add character without selecting a player')
            }
            addMutation.mutate({ ...characterData, playerId: player.id })
        }
    }

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleRoleChange = (value: string) => {
        handleInputChange('role', value)
        // Reset class to first available option when role changes
        const availableClasses = ROLES_CLASSES_MAP[value] || []
        if (availableClasses.length > 0) {
            handleInputChange('class', availableClasses[0])
        }
    }

    const filteredClasses = ROLES_CLASSES_MAP[formData.role] || []
    const isLoading = addMutation.isPending || editMutation.isPending

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'New' : 'Edit'} character for {player?.name}
                    </DialogTitle>
                    <DialogDescription>
                        Enter the correct character name as it appears in-game
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Realm Field */}
                    <div className="space-y-2">
                        <Label htmlFor="realm">Realm</Label>
                        <Select
                            value={formData.realm}
                            onValueChange={value => handleInputChange('realm', value)}
                        >
                            <SelectTrigger className={errors.realm ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a server" />
                            </SelectTrigger>
                            <SelectContent>
                                {REALMS.EU.map(r => (
                                    <SelectItem key={r.slug} value={r.slug}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.realm && <p className="text-sm text-red-500">{errors.realm}</p>}
                    </div>

                    {/* Role Field */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={handleRoleChange}>
                            <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map(r => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                    </div>

                    {/* Class Field */}
                    <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select
                            value={formData.class}
                            onValueChange={value => handleInputChange('class', value)}
                        >
                            <SelectTrigger className={errors.class ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredClasses.map(c => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
                    </div>

                    {/* Main Character Checkbox */}
                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <Checkbox
                            id="main"
                            checked={formData.main as CheckedState}
                            onCheckedChange={checked => handleInputChange('main', checked === true)}
                            className="h-5 w-5"
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="main">Main Character</Label>
                            <p className="text-sm text-muted-foreground">
                                Check this if this is the player&apos;s main character.
                            </p>
                        </div>
                    </div>

                    <Button disabled={isLoading} type="submit">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
