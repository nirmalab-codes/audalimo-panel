import { type DocumentItemDto } from "./DocumentRelated.response"

export type DriverSessionItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    token: string,
    ip_address: string,
    device: string,
    platform: string,
    latitude: number,
    longitude: number
}

export type DriverItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    first_name: string,
    middle_name: string,
    last_name: string,
    email: string,
    phone: string,
    phone_home: string,
    gender: number,
    date_of_birth: Date,
    token_verify: string,
    address: string,
    national: string,
    experience: number,
    is_active: boolean,
    is_verified: boolean,
    is_email_valid: boolean,
    is_blocked: boolean,
    upload_id: string,
    upload: string,
    sessions: Array<DriverSessionItemDto>
}

export type DriverDocumentItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    selfie_id: Array<DocumentItemDto>,
    selfie_status: string,
    high_school: string,
    university: string,
    cv_id: Array<DocumentItemDto>,
    cv_status: string,
    photo_passport_id: Array<DocumentItemDto>,
    doc_passport_id: Array<DocumentItemDto>,
    passport_status: string,
    emirates_state: string,
    emirates_id: Array<DocumentItemDto>,
    driving_license_id: Array<DocumentItemDto>,
    emirates_status: string,
    visa_type: string,
    visa_visit: null,
    visa_residency: Array<DocumentItemDto>,
    visa_cancel: Array<DocumentItemDto>,
    doc_title_notes: null,
    doc_notes: null,
    visa_status: string,
    doc_status: string,
    driver: DriverItemDto
}