import { type BaseDto } from './Base.response';
import type { UploadDto } from './UploadRelated.response';

export type VehicleDto = BaseDto & {
    vehicle_type: string;
    vehicle_number: string;
    year_model: number;
    registration_date: Date;
    expiration_date: Date;
    insurance_date: Date;
    insurance_number: string;
    traffic_plate: string;
    seat: number;
    upload_id: string;
    qat_latitude?: number | null;
    qat_longitude?: number | null;
    qat_speed?: number | null;
    qat_odometer?: number | null;
    qat_direction?: number | null;
    qat_ignition?: boolean | null;
    qat_passenger_count?: boolean | null;
    qat_seat_count?: number | null;
    maintenance_km?: number | null;
    status: boolean;
    driver_ids: Array<ScheduleDto>;
    mulkiya_upload_id: string | null;
    mulkiya_upload: UploadDto | null;
    upload: UploadDto | null;
};

interface ScheduleDto {
    id: string;
    vehicle_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
}
