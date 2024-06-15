import { type ListResponse, type BaseDto } from "./Base.response";

export type LocationDto = BaseDto & {
    title: string,
    url_link: string,
    form_attr: string,
    location_status: boolean,
}

export type LocationListResponse = ListResponse<LocationDto>