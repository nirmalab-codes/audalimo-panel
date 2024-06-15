import { FormAttr } from "@/enums/LocationRelated.enum";

export type LocationVo = {
    id: string,
    title: string,
    urlLink: string,
    formAttr: FormAttr,
    locationStatus: boolean,
}

export function getDefaultLocationVo(): LocationVo {
    return {
        id: '',
        title: '',
        urlLink: '',
        formAttr: FormAttr.ENGLISH_TEST,
        locationStatus: false,
    };
}