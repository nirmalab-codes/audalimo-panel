import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import ApiService from '@/services/ApiService';
import { type LoginRequest } from '@/contracts/request/AuthRelated.request';
import { type UserVo } from '@/contracts/vo/User.vo';
import { type LoginResponse } from '@/contracts/response/AuthRelated.response';
import SecureStorageService from '@/services/SecureStorageService';
import AuthService from '@/services/AuthService';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        // @ts-ignore
        user: JSON.parse(SecureStorageService.getItem(AuthService.USER_DATA_KEY)),
        returnUrl: null
    }),
    actions: {
        async login(data: LoginRequest) {
            const rawResponse = await ApiService.post('/v1/auth/sign-in', data)
            const parsedResponse = rawResponse.data as LoginResponse
            // update pinia state
            this.user = {
                uid: parsedResponse.user.uid,
                fullname: parsedResponse.fullname,
                email: parsedResponse.email,
                accessToken: parsedResponse.access_token,
            } as UserVo;
            // store user details and jwt in local storage to keep user logged in between page refreshes
            SecureStorageService.setItem(AuthService.USER_DATA_KEY, JSON.stringify(this.user))
            ApiService.setHeader()
            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/dashboards/modern');
        },
        async logout() {
            try {
                const rawResponse = await ApiService.post('/v1/logout', {})
            } catch (error) {
                console.error(error)
            }finally{
                this.user = null;
                SecureStorageService.removeItem(AuthService.USER_DATA_KEY)
                ApiService.setHeader()
                router.push('/');
            }
        }
    }
});
