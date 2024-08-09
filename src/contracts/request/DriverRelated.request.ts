import type { DocId } from "./DocumentRelated.request";

export type UpdateNoteRequest = {
    doc_title_notes: string;
    doc_notes: string;
};

export type UpdateStatusRequest = {
    doc_status: string;
};

export type UpdateApplicationFormStatusRequest = {
    application_status: string;
};

export type UpdateApplicationFormNotesRequest = {
    application_title_notes: string;
    application_notes: string;
};

export type UpdateOfferLetterStatusRequest = {
    lo_status: string;
};

export type UpdateOfferLetterNotesRequest = {
    letter_title_notes: string;
    letter_notes: string;
};

export type UpdateEmploymentResidencyStatusRequest = {
    residency_status: string;
};

export type UpdateEmploymentResidencyNotesRequest = {
    residency_title_notes: string;
    residency_notes: string;
};

export type UpdateRtaTrainingRequest = {
    training_start_date: string;
    training_end_date: string;
    training_start_time: string;
    training_end_time: string;
    training_location: string;
};

export type UpdateRtaStatusRequest = {
    rta_status: string;
};

export type UpdateRtaNotesRequest = {
    rta_title_notes: string;
    rta_notes: string;
};

export type UpdateRtaPermitRequest = {
    rta_permit_id: DocId[]
}
