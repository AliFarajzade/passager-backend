export type TUser = {
    name: string
    email: string
    photo: string
    password: string
    confirmPassword?: string
    passwordChangedAt?: Date
}

export type TJWTDecodedType = { id: string; iat: number; exp: number }
