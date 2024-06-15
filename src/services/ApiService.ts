import type { App } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import type { AxiosResponse } from 'axios';
import AuthService from './AuthService';
import * as binary from 'bops';

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
    public static bufferAsImage(resource: string): Promise<string> {
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
