import { defineStore } from 'pinia';
// project imports
import { type LocationListResponse } from '@/contracts/response/LocationRelated.response';
import { type LocationVo } from '@/contracts/vo/Location.vo';
import ApiService from '@/services/ApiService';
import { FormAttr } from '@/enums/LocationRelated.enum';
import { type LocationCreateRequest, type LocationUpdateRequest } from '@/contracts/request/LocationRelated.request';

export const useLocationStore = defineStore({
    id: 'Location',
    state: () => ({
        locations: [] as Array<LocationVo>
    }),
    getters: {},
    actions: {
        async fetchLocations() {
            const rawResponse = await ApiService.get('/location');
            const parsedResponse = rawResponse.data as LocationListResponse;
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
            const request = toCreateRequest(location);
            const response = await ApiService.post('/location', request);
            if (response.status === 201) {
                await this.fetchLocations();
            }
        },
        async updateLocation(location: LocationVo) {
            const request = toUpdateRequest(location);
            const response = await ApiService.put(`/location/${location.id}`, request);
            if (response.status === 200) {
                await this.fetchLocations();
            }
        },
        async deleteLocation(locationId: string) {
            const response = await ApiService.delete(`/location/soft-delete/${locationId}`);
            if (response.status === 200) {
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
