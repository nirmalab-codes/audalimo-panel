import { defineStore } from 'pinia';
import { type SingleResponse, type ListResponse, type BaseResponse } from '../contracts/response/Base.response';
import type {
    DriverApplicationFormItemDto,
    DriverDocumentItemDto,
    DriverEmploymentResidencyItemDto,
    DriverItemDto,
    DriverOfferLetterItemDto,
    DriverRtaItemDto,
    DriverStepItemDto
} from '../contracts/response/DriverRelated.response';
import ApiService from '@/services/ApiService';
import type {
    UpdateStatusRequest,
    UpdateNoteRequest,
    UpdateOfferLetterStatusRequest,
    UpdateOfferLetterNotesRequest,
    UpdateEmploymentResidencyStatusRequest,
    UpdateEmploymentResidencyNotesRequest,
    UpdateRtaStatusRequest,
    UpdateRtaNotesRequest,
    UpdateApplicationFormStatusRequest,
    UpdateApplicationFormNotesRequest,
    UpdateRtaPermitRequest,
    UpdateRtaTrainingRequest
} from '@/contracts/request/DriverRelated.request';
import { toast } from 'vue3-toastify';
import type { SendNotificationRequest } from '@/contracts/request/NotificationRelated.request';

export const useNotificationStore = defineStore({
    id: 'notification',
    state: () => ({
        //
    }),
    actions: {
        async sendNotification(payload: SendNotificationRequest, skipToast = true) {
            const rawResponse = await ApiService.post(`/v1/notification`, payload);
            console.log("AAA", rawResponse.data)
            const parsedResponse = rawResponse.data as SingleResponse<BaseResponse>;
            if(!skipToast) toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateStatus(documentId: string, payload: UpdateStatusRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-document/doc-status/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverDocumentItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateApplicationFormStatus(documentId: string, payload: UpdateApplicationFormStatusRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-application/application-status/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverApplicationFormItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateApplicationFormNotes(documentId: string, payload: UpdateApplicationFormNotesRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-application/notes/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverApplicationFormItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateOfferLetterStatus(documentId: string, payload: UpdateOfferLetterStatusRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-letter/lo-status/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverOfferLetterItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateOfferLetterNotes(documentId: string, payload: UpdateOfferLetterNotesRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-letter/notes/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverOfferLetterItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateEmploymentResidencyStatus(documentId: string, payload: UpdateEmploymentResidencyStatusRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-residency/residency-status/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverEmploymentResidencyItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateEmploymentResidencyNotes(documentId: string, payload: UpdateEmploymentResidencyNotesRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-residency/notes/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverEmploymentResidencyItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateRtaTrainingSchedule(documentId: string, payload: UpdateRtaTrainingRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-rta/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverRtaItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateRtaStatus(documentId: string, payload: UpdateRtaStatusRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-rta/rta-status/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverRtaItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateRtaNotes(documentId: string, payload: UpdateRtaNotesRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-rta/notes/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverRtaItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateRtaPermit(driverId: string, payload: UpdateRtaPermitRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-rta/upload-rta-permit/${driverId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverRtaItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
    }
});
