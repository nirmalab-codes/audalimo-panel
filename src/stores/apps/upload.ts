import { defineStore } from 'pinia';
import axios from 'axios';
import { type UploadListResponse } from '@/contracts/response/UploadRelated.response';


export const useUploadStore = defineStore({
    id: 'Upload',
    state: () => ({
        uploading: false,
        uploadSuccess: false,
        uploadError: '',
        signedUrl: ''
    }),
    actions: {
        async upload(file: File) {
            this.uploading = true;
            this.uploadSuccess = false;
            this.uploadError = '';
            this.signedUrl = '';
        
            try {
                const formData = new FormData();
                formData.append('file', file);
                const rawResponse = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
        
                const response = rawResponse.data as UploadListResponse;
                console.log('response', response);
        
                this.signedUrl = response.data[0].signed_url;
                this.uploadSuccess = true;
                this.uploading = false;
                return response.data[0];
            } catch (error) {
                this.uploadError = 'Failed to upload file';
                this.uploading = false;
                return null;
            }
        }
    }
});