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
                return {
                    id: vehicle.id,
                    name: vehicle.name,
                    registrationDate: vehicle.registration_date,
                    licensePlate: vehicle.license_plate,
                    ownership: vehicle.ownership,
                    vehicleType: vehicle.vehicle_type,
                    rtaOffice: vehicle.rta_office,
                    driverIds: vehicle.driver_ids,
                    driverNames: vehicle.vehicle_drivers,
                    seat: vehicle.seat
                };
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
        name: vehicle.name,
        registration_date: vehicle.registrationDate,
        license_plate: vehicle.licensePlate,
        ownership: vehicle.ownership,
        vehicle_type: vehicle.vehicleType,
        rta_office: vehicle.rtaOffice,
        driver_ids: vehicle.driverIds,
        vehicle_drivers: vehicle.driverNames,
        seat: vehicle.seat
    };
}

function toUpdateRequest(vehicle: VehicleVo): VehicleUpdateRequest {
    return {
        name: vehicle.name,
        registration_date: vehicle.registrationDate,
        license_plate: vehicle.licensePlate,
        ownership: vehicle.ownership,
        vehicle_type: vehicle.vehicleType,
        rta_office: vehicle.rtaOffice,
        driver_ids: vehicle.driverIds,
        vehicle_drivers: vehicle.driverNames,
        seat: vehicle.seat
    };
}
