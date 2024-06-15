export type BaseResponse = {
    statusCode: number,
    message: string,
    errors?: {
        [key: string]: string
    },
}

export type ListResponse<T> = BaseResponse & {
    data: Array<T>
    total: number
}

export type SingleResponse<T> = BaseResponse & {
    data: T
}