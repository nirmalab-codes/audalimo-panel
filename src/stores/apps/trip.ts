import { defineStore } from 'pinia';
// project imports
import { type TripCreateRequest, type TripUpdateRequest } from '@/contracts/request/TripRelated.request';
import { type BaseResponse, type ListResponse, type SingleResponse } from '@/contracts/response/Base.response';
import { type TripDto } from '@/contracts/response/TripRelated.response';
import { type TripVo } from '@/contracts/vo/Trip.vo';
import ApiService from '@/services/ApiService';
import { toast } from 'vue3-toastify';

export const useTripStore = defineStore({
    id: 'Trip',
    state: () => ({
        trips: [] as Array<TripVo>
    }),
    getters: {},
    actions: {
        async fetchTrips() {
            const rawResponse = await ApiService.query('/v1/trip', {});
            const parsedResponse = rawResponse.data as ListResponse<TripDto>;
            const trips: Array<TripVo> = parsedResponse.data.map((trip) => {
                return trip;
            });
            this.trips = trips;
        },
        async createTrip(trip: TripVo) {
            const payload: TripCreateRequest = toCreateRequest(trip);
            const rawResponse = await ApiService.post('/v1/trip', payload);
            const parsedResponse = rawResponse.data as SingleResponse<TripDto>;
            if (rawResponse.status === 201) {
                toast.success(parsedResponse.message);
                await this.fetchTrips();
            }
        },
        async updateTrip(trip: TripVo) {
            const payload: TripUpdateRequest = toUpdateRequest(trip);
            const rawResponse = await ApiService.put(`/v1/trip/${trip.id}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<TripDto>;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchTrips();
            }
        },
        async deleteTrip(tripId: string) {
            const rawResponse = await ApiService.delete(`/v1/trip/soft-delete/${tripId}`);
            const parsedResponse = rawResponse.data as BaseResponse;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchTrips();
            }
        }
    }
});

function toCreateRequest(trip: TripVo): TripCreateRequest {
    return {
        trip_date: trip.trip_date,
        start_time: trip.start_time,
        payment_type: trip.payment_type,
        distance_km: trip.distance_km,
        duration_minutes: trip.duration_minutes,
        total_fare: trip.total_fare,
        commission: trip.commission,
        toll: trip.toll,
        taxes: trip.taxes,
        service_fee: trip.service_fee,
        rta_fee: trip.rta_fee,
        refunds: trip.refunds,
        tips: trip.tips,
        app_used: trip.app_used,
        start_location_name: trip.start_location_name,
        end_location_name: trip.end_location_name,
        upload_id: trip.upload_id,
        driver_id: trip.driver_id
    };
}

function toUpdateRequest(trip: TripVo): TripUpdateRequest {
    return {
        trip_date: trip.trip_date,
        start_time: trip.start_time,
        payment_type: trip.payment_type,
        distance_km: trip.distance_km,
        duration_minutes: trip.duration_minutes,
        total_fare: trip.total_fare,
        commission: trip.commission,
        toll: trip.toll,
        taxes: trip.taxes,
        service_fee: trip.service_fee,
        rta_fee: trip.rta_fee,
        refunds: trip.refunds,
        tips: trip.tips,
        app_used: trip.app_used,
        start_location_name: trip.start_location_name,
        end_location_name: trip.end_location_name,
        driver_id: trip.driver_id,
        upload_id: trip.upload_id
    };
}
