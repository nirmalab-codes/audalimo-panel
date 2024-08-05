import { FormAttr } from "@/enums/DocumentRelated.enum";

export type DocIdVo = {
    id: string,
    signedUrl: string,
}

export type BufferedDocIdVo = {
    id: string,
    signedUrl: string,
    byteUrl: string,
    name?: string,
}

export type DocumentVo = {
    id: string,
    title: string,
    docId: DocIdVo[],
    formAttr: FormAttr,
    urlDocStatus: boolean,
}

export function getDefaultDocumentVo(): DocumentVo {
    return {
        id: '',
        title: '',
        docId: [],
        formAttr: FormAttr.MEDICAL_FORM,
        urlDocStatus: false,
    };
}