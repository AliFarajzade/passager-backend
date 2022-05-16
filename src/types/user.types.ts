export type TUser = {
    name: string
    email: string
    photo?: string
    password: string
    confirmPassword?: string
    passwordChangedAt?: Date
    role: 'user' | 'guide' | 'lead-guide' | 'admin'
}

export type TJWTDecodedType = { id: string; iat: number; exp: number }
