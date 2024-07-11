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
