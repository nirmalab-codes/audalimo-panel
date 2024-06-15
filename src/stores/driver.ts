import { defineStore } from "pinia";
import { type SingleResponse, type ListResponse } from '../contracts/response/Base.response'
import { type DriverDocumentItemDto, type DriverItemDto } from '../contracts/response/DriverRelated.response'
import ApiService from "@/services/ApiService";

export const useDriverStore = defineStore({
    id: 'driver',
    state: () => ({
        driverList: [] as Array<DriverItemDto>,
    }),
    actions: {
        async retrieveList() {
            const rawResponse = await ApiService.query('/v1/driver', {})
            const parsedResponse = rawResponse.data as ListResponse<DriverItemDto>
            this.driverList = parsedResponse.data
        },
        async retrieveLatestDocuments(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-document', {
                params: {
                    driver_id: id
                }
            })
            const parsedResponse = rawResponse.data as SingleResponse<DriverDocumentItemDto>
            // return parsedResponse.data.sort((a,b) => (new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime())
            return parsedResponse.data
        },
    }
});
