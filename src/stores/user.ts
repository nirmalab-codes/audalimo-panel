import { defineStore } from 'pinia';
import { type SingleResponse, type ListResponse } from '../contracts/response/Base.response';
import type {
    ChangePasswordRequest,
    MessageResponse,
    UpdateUserRequest,
    UserItemDto,
} from '../contracts/response/UserRelated.response';
import ApiService from '@/services/ApiService';
import { toast } from 'vue3-toastify';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userList: [] as Array<UserItemDto>
    }),
    actions: {
        async retrieveList() {
            const rawResponse = await ApiService.query('/v1/user', {});
            const parsedResponse = rawResponse.data as ListResponse<UserItemDto>;
            this.userList = parsedResponse.data;
        },
        async retrieveMe() {
            const rawResponse = await ApiService.get('/v1/me');
            const parsedResponse = rawResponse.data as SingleResponse<UserItemDto>;
            return parsedResponse.data;
        },
        async changePassword(payload: ChangePasswordRequest) {
            const rawResponse = await ApiService.post(`/v1/user/change-password/`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<MessageResponse>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async createUser(payload: UpdateUserRequest) {
            const rawResponse = await ApiService.post(`/v1/user`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<UserItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async updateUser(userId: string, payload: UpdateUserRequest) {
            const rawResponse = await ApiService.put(`/v1/user/${userId}`, payload);
            const parsedResponse = rawResponse.data as SingleResponse<UserItemDto>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
        async deleteUser(userId: string) {
            const rawResponse = await ApiService.delete(`/v1/user/soft-delete/${userId}`);
            const parsedResponse = rawResponse.data as SingleResponse<MessageResponse>;
            toast.success(parsedResponse.message);
            return parsedResponse.data;
        },
    }
});
