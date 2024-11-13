import type { UploadDto } from "../response/UploadRelated.response";

export function getDefaultVehicleVo(): VehicleVo {
    return {
        id: '',
        vehicle_type: '',
        vehicle_number: '',
        year_model: 0,
        registration_date: '',
        expiration_date: '',
        insurance_date: '',
        insurance_number: '',
        traffic_plate: '',
        upload_id: '',
        mulkiya_upload_id: '',
        seat: 0,
        maintenance_km: 0,
        qat_latitude: null,
        qat_longitude: null,
        qat_speed: null,
        qat_odometer: null,
        qat_direction: null,
        qat_ignition: null,
        qat_passenger_count: null,
        qat_seat_count: null,
        status: true,
        driver_ids: [],
        upload: null,
        mulkiya_upload: null
    };
}

export type VehicleVo = {
    id: string;
    vehicle_type: string;
    vehicle_number: string;
    year_model: number;
    registration_date: string;
    expiration_date: string;
    insurance_date: string;
    insurance_number: string;
    traffic_plate: string;
    mulkiya_upload_id: string;
    upload_id: string;
    seat: number;
    maintenance_km: number;
    qat_latitude?: number | null;
    qat_longitude?: number | null;
    qat_speed?: number | null;
    qat_odometer?: number | null;
    qat_direction?: number | null;
    qat_ignition?: boolean | null;
    qat_passenger_count?: boolean | null;
    qat_seat_count?: number | null;
    status: boolean;
    driver_ids: Array<any>;
    upload: UploadDto | null;
    mulkiya_upload: UploadDto | null;
};

interface DriverShiftVo {
    driver_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
}
