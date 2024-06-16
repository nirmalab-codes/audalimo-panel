import { type ListResponse, type BaseDto } from "./Base.response";

export type DocumentItemDto = {
    id: string,
    signed_url: string,
}

export type DocumentDto = BaseDto & {
    title: string,
    doc_id: DocumentItemDto[],
    form_attr: string,
    url_doc_status: boolean,
}
