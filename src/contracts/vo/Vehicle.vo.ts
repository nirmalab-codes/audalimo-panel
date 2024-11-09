export function getDefaultVehicleVo(): VehicleVo {
    return {
        id: '',
        vehicle_type: '',
        vehicle_number: '',
        year_model: 0,
        registration_date: new Date(),
        expiration_date: new Date(),
        insurance_date: new Date(),
        insurance_number: '',
        traffic_plate: '',
        upload_id: '',
        seat: 0,
        qat_latitude: null,
        qat_longitude: null,
        qat_speed: null,
        qat_odometer: null,
        qat_direction: null,
        qat_ignition: null,
        qat_passenger_count: null,
        qat_seat_count: null,
        status: true,
        driver_ids: []
    };
}

export type VehicleVo = {
    id: string;
    vehicle_type: string;
    vehicle_number: string;
    year_model: number;
    registration_date: Date;
    expiration_date: Date;
    insurance_date: Date;
    insurance_number: string;
    traffic_plate: string;
    upload_id: string;
    seat: number;
    qat_latitude?: number | null;
    qat_longitude?: number | null;
    qat_speed?: number | null;
    qat_odometer?: number | null;
    qat_direction?: number | null;
    qat_ignition?: boolean | null;
    qat_passenger_count?: number | null;
    qat_seat_count?: number | null;
    status: boolean;
    driver_ids: Array<string>;
};
