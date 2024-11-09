import { defineStore } from 'pinia';
// project imports
import { type VehicleCreateRequest, type VehicleUpdateRequest } from '@/contracts/request/VehicleRelated.request';
import { type BaseResponse, type ListResponse, type SingleResponse } from '@/contracts/response/Base.response';
import { type VehicleDto } from '@/contracts/response/VehicleRelated.response';
import { type VehicleVo } from '@/contracts/vo/Vehicle.vo';
import ApiService from '@/services/ApiService';
import { toast } from 'vue3-toastify';

export const useVehicleStore = defineStore({
    id: 'Vehicle',
    state: () => ({
        vehicles: [] as Array<VehicleVo>
    }),
    getters: {},
    actions: {
        async fetchVehicles() {
            const rawResponse = await ApiService.query('/v1/vehicle', {});
            const parsedResponse = rawResponse.data as ListResponse<VehicleDto>;
            const vehicles: Array<VehicleVo> = parsedResponse.data.map((vehicle) => {
                return vehicle;
            });
            this.vehicles = vehicles;
        },
        async createVehicle(vehicle: VehicleVo) {
            const payload: VehicleCreateRequest = toCreateRequest(vehicle);
            const rawResponse = await ApiService.post('/v1/vehicle', payload);
            const parsedResponse = rawResponse.data as SingleResponse<VehicleDto>;
            if (rawResponse.status === 201) {
                toast.success(parsedResponse.message);
                await this.fetchVehicles();
            }
        },
        async updateVehicle(vehicle: VehicleVo) {
            const payload: VehicleUpdateRequest = toUpdateRequest(vehicle);
            const rawResponse = await ApiService.put(`/v1/vehicle/${vehicle.id}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<VehicleDto>;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchVehicles();
            }
        },
        async deleteVehicle(vehicleId: string) {
            const rawResponse = await ApiService.delete(`/v1/vehicle/soft-delete/${vehicleId}`);
            const parsedResponse = rawResponse.data as BaseResponse;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchVehicles();
            }
        }
    }
});

function toCreateRequest(vehicle: VehicleVo): VehicleCreateRequest {
    return {
        vehicle_type: vehicle.vehicle_type,
        vehicle_number: vehicle.vehicle_number,
        year_model: vehicle.year_model,
        registration_date: vehicle.registration_date,
        expiration_date: vehicle.expiration_date,
        insurance_date: vehicle.insurance_date,
        insurance_number: vehicle.insurance_number,
        traffic_plate: vehicle.traffic_plate,
        upload_id: vehicle.upload_id,
        seat: vehicle.seat,
        qat_latitude: vehicle.qat_latitude,
        qat_longitude: vehicle.qat_longitude,
        qat_speed: vehicle.qat_speed,
        qat_odometer: vehicle.qat_odometer,
        qat_direction: vehicle.qat_direction,
        qat_ignition: vehicle.qat_ignition,
        qat_passenger_count: vehicle.qat_passenger_count,
        qat_seat_count: vehicle.qat_seat_count,
        status: vehicle.status,
        driver_ids: vehicle.driver_ids
    };
}

function toUpdateRequest(vehicle: VehicleVo): VehicleUpdateRequest {
    return {
        vehicle_type: vehicle.vehicle_type,
        vehicle_number: vehicle.vehicle_number,
        year_model: vehicle.year_model,
        registration_date: vehicle.registration_date,
        expiration_date: vehicle.expiration_date,
        insurance_date: vehicle.insurance_date,
        insurance_number: vehicle.insurance_number,
        traffic_plate: vehicle.traffic_plate,
        upload_id: vehicle.upload_id,
        seat: vehicle.seat,
        qat_latitude: vehicle.qat_latitude,
        qat_longitude: vehicle.qat_longitude,
        qat_speed: vehicle.qat_speed,
        qat_odometer: vehicle.qat_odometer,
        qat_direction: vehicle.qat_direction,
        qat_ignition: vehicle.qat_ignition,
        qat_passenger_count: vehicle.qat_passenger_count,
        qat_seat_count: vehicle.qat_seat_count,
        status: vehicle.status,
        driver_ids: vehicle.driver_ids
    };
}
