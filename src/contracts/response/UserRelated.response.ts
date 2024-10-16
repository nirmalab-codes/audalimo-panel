export type UserSessionItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    token: string,
    ip_address: string,
    device: string,
    platform: string,
    latitude: number,
    longitude: number
}

export type UserRoleItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
    name: string
}

export type ChangePasswordRequest = {
    current_password: string,
    new_password: string,
    confirm_new_password: string
}

export type UpdateUserRequest = {
    fullname: string,
    email: string,
    phone: string | null,
    // date_of_birth: Date,
    address: string | null,
    is_active: boolean | null,
    role_id: string,
    new_password: string | null,
    confirm_new_password: string | null
}

export type UserItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
    fullname: string,
    email: string,
    phone: string | null,
    date_of_birth: Date,
    token_verify: string | null,
    address: string | null,
    experience: number,
    is_active: boolean,
    is_blocked: boolean,
    upload_id: string | null,
    upload: string | null,
    role_id: string,
    role: UserRoleItemDto,
    sessions: Array<UserSessionItemDto>
}
export type MessageResponse = {
    statusCode: number,
    message: string
}