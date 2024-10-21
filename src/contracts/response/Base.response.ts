export type BaseDto = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type BaseResponse = {
    statusCode: number;
    message: string;
    errors?: {
        [key: string]: string;
    };
};

export type ListResponse<T> = BaseResponse & {
    data: Array<T>;
    total: number;
    meta?: object;
};

export type SingleResponse<T> = BaseResponse & {
    data: T;
};
