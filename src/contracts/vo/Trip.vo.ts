import type { UserVo } from "./User.vo";

export function getDefaultTripVo(): TripVo {
    return {
        id: '',
        trip_date: new Date(),
        start_time: '',
        payment_type: '',
        distance_km: 0,
        duration_minutes: 0,
        total_fare: 0,
        tips: 0,
        toll: 0,
        taxes: 0,
        service_fee: 0,
        rta_fee: 0,
        net_fare: 0,
        refunds: 0,
        app_used: '',
        start_location_name: '',
        end_location_name: '',
        upload_id: '',
        driver_id: '',
        upload: null,
        driver: null,
        verified: null,
        ocr_status: null,
        user: null,
        updated_at: null
    };
}

export type TripVo = {
    id: string;
    trip_date: Date;
    start_time: string;
    payment_type: string;
    distance_km: number;
    duration_minutes: number;
    total_fare: number;
    tips: number;
    toll: number;
    taxes: number;
    service_fee: number;
    rta_fee: number;
    refunds: number;
    app_used: string;
    start_location_name: string;
    start_latitude?: number | null;
    start_longitude?: number | null;
    end_location_name: string;
    end_latitude?: number | null;
    end_longitude?: number | null;
    net_fare: number;
    upload_id: string;
    driver_id: string;
    upload?: any | null;
    driver?: any | null;
    verified?: boolean | null;
    verified_by?: string | null;
    ocr_status?: string | null;
    user?: UserVo | null;
    updated_at?: Date | null;
};
