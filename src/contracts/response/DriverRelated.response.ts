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
    status_step: string,
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

export type DriverDodItemDto = {
    name_dependent: string,
    relationship_dependent: string,
    date_dependent: Date
}

export type DriverEqualificationItemDto = {
    name_school: string,
    name_course: string,
    address_education: string,
    date_education: Date
}

export type DriverLangProofItemDto = {
    name_school: string,
    name_course: string,
    address_education: string,
    level: string
}

export type DriverTrainAttendItemDto = {
    date_training: Date,
    course_title: string
}

export type DriverEmployHistoryItemDto = {
    name_company: string,
    country_employ: string,
    position_employ: string,
    job_responsibility: string,
    start_employ: Date,
    end_employ: Date
}

export type DriverApplicationFormItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    job_name_company: string,
    job_present: string,
    job_position: string,
    job_division: string,
    job_date_join: Date,
    job_email: string,
    job_fullname: string,
    job_fathername: string
    job_mothername: string,
    job_passport_number: string,
    job_place_issue: string,
    job_date_expiry: Date,
    job_place_birth: string,
    job_date_birth: Date,
    job_age: number,
    job_religion: string,
    job_nation: string,
    job_gender: number,
    job_marital: string,
    cn_mobile: string,
    cn_home: string,
    dod: Array<DriverDodItemDto>,
    cp_emergency_name: string,
    cp_emergency_number: string,
    dnok_name: string,
    dnok_relationship: string,
    dnok_phone: string,
    dnok_mobile: string,
    equalification: Array<DriverEqualificationItemDto>,
    langprof: Array<DriverLangProofItemDto>,
    train_attend: Array<DriverTrainAttendItemDto>,
    employ_history: Array<DriverEmployHistoryItemDto>,
    ge_1: string,
    ge_2: string,
    ge_3: string,
    ge_4: string,
    ge_5: string,
    esignature_id: Array<DocumentItemDto>,
    cpd_first_fullname: string,
    cpd_first_phone: string,
    cpd_first_mobile: string,
    cpd_second_fullname: string,
    cpd_second_phone: string,
    cpd_second_mobile: string,
    app_form_status: string,
    link_form_medical: string,
    medical_form_id: Array<DocumentItemDto>,
    medical_form_status: string,
    application_title_notes: string,
    application_notes: string,
    application_status: string,
    driver: DriverItemDto,
}

export type DriverOfferLetterItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    link_letter: string | null,
    letter_id: Array<DocumentItemDto>,
    letter_status: string,
    letter_title_notes: string | null,
    letter_notes: string | null,
    lo_status: string,
    driver: DriverItemDto
}

export type DriverEmploymentResidencyItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    link_visit_permit: string | null,
    link_amer_center: string | null,
    link_emirates_bio: string | null,
    link_labor: string | null,
    doc_papper_id: Array<DocumentItemDto>,
    doc_labor_id: Array<DocumentItemDto>,
    doc_contract_id: Array<DocumentItemDto>,
    doc_status: string,
    link_english_test: string | null,
    english_id: Array<DocumentItemDto>,
    english_status: string,
    police_id: Array<DocumentItemDto>,
    police_status: string,
    residency_status: boolean,
    driver: DriverItemDto
}

export type DriverRtaItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    link_our_office: string | null,
    training_start_date: string | null,
    training_start_time: string | null,
    training_end_date: string | null,
    training_end_time: string | null,
    training_location: string | null,
    url_location: string | null,
    link_medical_test: string | null,
    medical_test_id: Array<DocumentItemDto>,
    medical_status: string,
    link_rta_test: string | null,
    rta_permit_id: string | null,
    rta_permit_status: string,
    rta_title_notes: string | null,
    rta_notes: string | null,
    rta_status: string,
    driver: DriverItemDto
}

export type DriverStepItemDto = {
    id: string,
    created_at: Date,
    updated_at: Date,
    driver_id: string,
    step: string,
    progress: number,
    status_step: string
}

export enum StatusStep {
    Open = 'open',
    Pending = 'pending',
    Review = 'review',
    Approved = 'approved',
    Rejected = 'rejected',
}
