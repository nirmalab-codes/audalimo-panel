export type AddNoteRequest = {
    doc_title_notes: string;
    doc_notes: string;
};

export type UpdateStatusRequest = {
    doc_status: string;
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

export type UpdateRtaStatusRequest = {
    rta_status: string;
};

export type UpdateRtaNotesRequest = {
    rta_title_notes: string;
    rta_notes: string;
};
