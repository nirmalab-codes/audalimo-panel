import type { App } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import type { AxiosError, AxiosResponse } from 'axios';
import AuthService from './AuthService';
import { toast } from 'vue3-toastify';
import { type BaseResponse } from '@/contracts/response/Base.response';
import SecureStorageService from './SecureStorageService';
import { useRouter } from 'vue-router';

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
    /**
     * @description property to share vue instance
     */
    public static vueInstance: App;

    /**
     * @description initialize vue axios
     */
    public static init(app: App<Element>) {
        ApiService.vueInstance = app;
        ApiService.vueInstance.use(VueAxios, axios);
        ApiService.vueInstance.axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
        ApiService.setHeader();

        // Add a request interceptor
        ApiService.vueInstance.axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        ApiService.vueInstance.axios.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        }, function (error: AxiosError) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error

            if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                    // Handle 401 error
                    SecureStorageService.removeItem(AuthService.USER_DATA_KEY);
                    ApiService.setHeader();

                    // Redirect to login page
                    const router = useRouter(); // Get the router instance
                    router.push({ name: 'auth/login' }); // Redirect to the login route
                }

                // Toastable error handling
                const is4xxError = status >= 400 && status < 500;
                const is5xxError = status >= 500 && status < 600;
                let errMessage = "";
                if (is4xxError) {
                    let baseResponse = error.response.data as BaseResponse;
                    if (baseResponse?.errors) {
                        errMessage = baseResponse?.errors[Object.keys(baseResponse?.errors)[0]];
                    } else if (baseResponse?.message) {
                        errMessage = baseResponse?.message;
                    } else {
                        errMessage = error.message;
                    }
                } else if (is5xxError) {
                    errMessage = "Oops... something went wrong";
                }

                toast.error(errMessage);
            }

            return Promise.reject(error);
        });

    }

    /**
     * @description set the default HTTP request headers
     */
    public static setHeader(): void {
        if (AuthService.getToken()) {
            ApiService.vueInstance.axios.defaults.headers.common['Authorization'] = `Bearer ${AuthService.getToken()}`;
        }
        // ApiService.vueInstance.axios.defaults.headers.common[
        //   "token"
        // ] = `${AuthService.getToken()}`;
        ApiService.vueInstance.axios.defaults.headers.common['Accept'] = 'application/json';
    }

    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static query(resource: string, params: any): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.get(resource, params);
    }

    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param slug: string
     * @returns Promise<AxiosResponse>
     */
    public static get(resource: string, slug = '' as string): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
    }

    /**
     * @description set the POST HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static post(resource: string, params: any): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.post(`${resource}`, params);
    }

    /**
     * @description send the UPDATE HTTP request
     * @param resource: string
     * @param slug: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static update(resource: string, slug: string, params: any): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
    }

    /**
     * @description Send the PUT HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static put(resource: string, params: any): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.put(`${resource}`, params);
    }

    /**
     * @description Send the DELETE HTTP request
     * @param resource: string
     * @returns Promise<AxiosResponse>
     */
    public static delete(resource: string): Promise<AxiosResponse> {
        return ApiService.vueInstance.axios.delete(resource);
    }

    /**
     * @description Send request to buffer image
     * @param resource: string
     * @returns Promise<AxiosResponse>
     */
    public static bufferAsByteUrl(resource: string): Promise<string> {
        resource = resource.replace(import.meta.env.VITE_APP_API_URL, '');
        return ApiService.vueInstance.axios
            .get(resource, { responseType: 'blob' })
            .then((response) => {
              const imageUrl = URL.createObjectURL(response.data);
                return Promise.resolve(imageUrl)
            })
            .catch((error) => Promise.reject(error));
    }
}

export default ApiService;
