import { defineStore } from 'pinia';
// project imports
import { type LocationCreateRequest, type LocationUpdateRequest } from '@/contracts/request/LocationRelated.request';
import { type BaseResponse, type ListResponse, type SingleResponse } from '@/contracts/response/Base.response';
import { type LocationDto } from '@/contracts/response/LocationRelated.response';
import { type LocationVo } from '@/contracts/vo/Location.vo';
import { FormAttr } from '@/enums/LocationRelated.enum';
import ApiService from '@/services/ApiService';
import { toast } from 'vue3-toastify';

export const useLocationStore = defineStore({
    id: 'Location',
    state: () => ({
        locations: [] as Array<LocationVo>
    }),
    getters: {},
    actions: {
        async fetchLocations() {
            const rawResponse = await ApiService.query('/v1/location', {});
            const parsedResponse = rawResponse.data as ListResponse<LocationDto>;
            const locations: Array<LocationVo> = parsedResponse.data.map((location) => {
                return {
                    id: location.id,
                    title: location.title,
                    urlLink: location.url_link,
                    formAttr: location.form_attr as FormAttr,
                    locationStatus: location.location_status
                };
            });
            this.locations = locations;
        },
        async createLocation(location: LocationVo) {
            const payload: LocationCreateRequest = toCreateRequest(location);
            const rawResponse = await ApiService.post('/v1/location', payload);
            const parsedResponse = rawResponse.data as SingleResponse<LocationDto>;
            if (rawResponse.status === 201) {
                toast.success(parsedResponse.message);
                await this.fetchLocations();
            }
        },
        async updateLocation(location: LocationVo) {
            const payload: LocationUpdateRequest = toUpdateRequest(location);
            const rawResponse = await ApiService.put(`/v1/location/${location.id}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<LocationDto>;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchLocations();
            }
        },
        async deleteLocation(locationId: string) {
            const rawResponse = await ApiService.delete(`/v1/location/soft-delete/${locationId}`);
            const parsedResponse = rawResponse.data as BaseResponse;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchLocations();
            }
        }
    }
});

function toCreateRequest(location: LocationVo): LocationCreateRequest {
    return {
        title: location.title,
        url_link: location.urlLink,
        form_attr: location.formAttr
    };
}

function toUpdateRequest(location: LocationVo): LocationUpdateRequest {
    return {
        location_status: location.locationStatus
    };
}
