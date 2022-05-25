export type TUser = {
    _id: string
    name: string
    email: string
    photo?: string
    password?: string
    confirmPassword?: string
    passwordChangedAt?: number | Date
    role: 'user' | 'guide' | 'lead-guide' | 'admin'
    hashedResetPasswordToken?: string
    resetPasswordTokenExpireTime?: number
}

export type TJWTDecodedType = { id: string; iat: number; exp: number }
