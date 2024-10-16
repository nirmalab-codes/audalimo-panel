import { type BaseResponse } from "./Base.response";

export type UserLoginDto = {
    uid: string,
}

export type LoginResponse = BaseResponse & {
    access_token: string,
    expires_in: number,
    token_type: string,
    user: UserLoginDto,
    email: string,
    fullname: string,
    role_id: string,
    role: object
}