import { type UploadListResponse } from '@/contracts/response/UploadRelated.response';
import axios from 'axios';
import { defineStore } from 'pinia';


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
                formData.append('file_upload', file);
                formData.append('type', 'image');

                // TODO: Move this to ApiService
                const rawResponse = await axios.post('/v1/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const parsedResponse = rawResponse.data as UploadListResponse;
        
                this.signedUrl = parsedResponse.data[0].signed_url;
                this.uploadSuccess = true;
                this.uploading = false;
                return parsedResponse.data[0];
            } catch (error) {
                console.error('>> error', error);
                this.uploadError = 'Failed to upload file';
                this.uploading = false;
                return null;
            }
        }
    }
});