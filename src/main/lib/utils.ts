import { v4 as uuid } from 'uuid'

export const isPresent = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined

export const newUUID = (): string => uuid()
