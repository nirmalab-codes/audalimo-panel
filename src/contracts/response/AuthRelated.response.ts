import { BaseResponse } from "./Base.response";

export type UserLoginDto = {
    uid: string,
}

export type LoginResponse = BaseResponse & {
    access_token: string,
    expires_in: number,
    token_type: string,
    user: UserLoginDto,
    fullname: string,
}