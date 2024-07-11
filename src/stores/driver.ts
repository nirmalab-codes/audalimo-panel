import { defineStore } from "pinia";
import { type SingleResponse, type ListResponse } from '../contracts/response/Base.response'
import type { DriverApplicationFormItemDto, DriverDocumentItemDto, DriverItemDto } from '../contracts/response/DriverRelated.response'
import ApiService from "@/services/ApiService";
import { type UpdateStatusRequest, type AddNoteRequest } from "@/contracts/request/DriverRelated.request";
import { toast } from "vue3-toastify";

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
            return parsedResponse.data
        },
        async addNote(documentId: string, payload: AddNoteRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-document/notes/${documentId}`, payload)
            const parsedResponse = rawResponse.data as SingleResponse<DriverDocumentItemDto>
            toast.success(parsedResponse.message)
            return parsedResponse.data
        },
        async updateStatus(documentId: string, payload: UpdateStatusRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-document/doc-status/${documentId}`, payload)
            const parsedResponse = rawResponse.data as SingleResponse<DriverDocumentItemDto>
            toast.success(parsedResponse.message)
            return parsedResponse.data
        },
        async retrieveLatestApplicationForm(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-application', {
                params: {
                    driver_id: id
                }
            })
            const parsedResponse = rawResponse.data as SingleResponse<DriverApplicationFormItemDto>
            return parsedResponse.data
        },
    }
});
