import { defineStore } from 'pinia';
import { type SingleResponse, type ListResponse } from '../contracts/response/Base.response';
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
    UpdateRtaPermitRequest
} from '@/contracts/request/DriverRelated.request';
import { toast } from 'vue3-toastify';

export const useDriverStore = defineStore({
    id: 'driver',
    state: () => ({
        driverList: [] as Array<DriverItemDto>
    }),
    actions: {
        async retrieveList() {
            const rawResponse = await ApiService.query('/v1/driver', {});
            const parsedResponse = rawResponse.data as ListResponse<DriverItemDto>;
            this.driverList = parsedResponse.data;
        },
        // TODO: Apakah ada satu endpoint untuk mendapatkan semua status dari dokumen sampai RTA training
        async retrieveLatestDocuments(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-document', {
                params: {
                    driver_id: id
                }
            });
            const parsedResponse = rawResponse.data as SingleResponse<DriverDocumentItemDto>;
            return parsedResponse.data;
        },
        async retrieveLatestApplicationForm(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-application', {
                params: {
                    driver_id: id
                }
            });
            const parsedResponse = rawResponse.data as SingleResponse<DriverApplicationFormItemDto>;
            return parsedResponse.data;
        },
        async retrieveLatestOfferLetter(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-letter', {
                params: {
                    driver_id: id
                }
            });
            const parsedResponse = rawResponse.data as SingleResponse<DriverOfferLetterItemDto>;
            return parsedResponse.data;
        },
        async retrieveLatestEmploymentResidency(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-residency', {
                params: {
                    driver_id: id
                }
            });
            const parsedResponse = rawResponse.data as SingleResponse<DriverEmploymentResidencyItemDto>;
            return parsedResponse.data;
        },
        async retrieveLatestRtaTraining(id: string) {
            const rawResponse = await ApiService.query('/v1/kyc-rta', {
                params: {
                    driver_id: id
                }
            });
            const parsedResponse = rawResponse.data as SingleResponse<DriverRtaItemDto>;
            return parsedResponse.data;
        },
        async retrieveAllStatus(id: string) {
            const rawResponse = await ApiService.get(`/v1/get-all-status/${id}`);
            const parsedResponse = rawResponse.data as SingleResponse<Array<DriverStepItemDto>>;
            return parsedResponse.data;
        },
        async updateNote(documentId: string, payload: UpdateNoteRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-document/notes/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverDocumentItemDto>;
            toast.success(parsedResponse.message);
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
        async updateRtaPermit(documentId: string, payload: UpdateRtaPermitRequest) {
            const rawResponse = await ApiService.put(`/v1/kyc-rta/upload-permit/${documentId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<DriverRtaItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
    }
});
