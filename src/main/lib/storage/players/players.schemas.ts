import { wowClassSchema, wowRolesSchema } from '@shared/schemas/wow.schemas'
import { z } from 'zod'

const playerStorageSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        chars: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                realm: z.string(),
                class: wowClassSchema,
                role: wowRolesSchema,
                playerId: z.string()
            })
        )
    })
    .transform((data) => ({
        id: data.id,
        name: data.name,
        characters: data.chars.map((char) => ({
            id: char.id,
            name: char.name,
            realm: char.realm,
            class: char.class,
            role: char.role
        }))
    }))

export const playersListStorageSchema = z.array(playerStorageSchema)
