import { type DocumentCreateRequest, type DocumentUpdateRequest } from '@/contracts/request/DocumentRelated.request';
import { type BaseResponse, type SingleResponse, type ListResponse } from '@/contracts/response/Base.response';
import { type DocumentDto } from '@/contracts/response/DocumentRelated.response';
import { type DocumentVo } from '@/contracts/vo/Document.vo';
import { FormAttr } from '@/enums/DocumentRelated.enum';
import ApiService from '@/services/ApiService';
import { defineStore } from 'pinia';
import { toast } from 'vue3-toastify';

export const useDocumentStore = defineStore({
    id: 'Document',
    state: () => ({
        documents: [] as Array<DocumentVo>
    }),
    getters: {},
    actions: {
        async fetchDocuments() {
            const rawResponse = await ApiService.query('/v1/url-document', {});
            const parsedResponse = rawResponse.data as ListResponse<DocumentDto>;
            const documents: Array<DocumentVo> = parsedResponse.data.map((document) => {
                return {
                    id: document.id,
                    title: document.title,
                    docId: document.doc_id.map((docId: any) => ({
                        id: docId.id,
                        signedUrl: docId.signed_url
                    })),
                    formAttr: document.form_attr as FormAttr,
                    urlDocStatus: document.url_doc_status
                };
            });
            this.documents = documents;
        },
        async createDocument(document: DocumentVo) {
            const request = toCreateRequest(document);
            const rawResponse = await ApiService.post('/v1/url-document', request);
            const parsedResponse = rawResponse.data as SingleResponse<DocumentDto>;
            if (rawResponse.status === 201) {
                toast.success(parsedResponse.message);
                await this.fetchDocuments();
            }
        },
        async updateDocument(document: DocumentVo) {
            const request = toUpdateRequest(document);
            const rawResponse = await ApiService.put(`/v1/url-document/${document.id}`, request);
            const parsedResponse = rawResponse.data as SingleResponse<DocumentDto>;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchDocuments();
            }
        },
        async deleteDocument(documentId: string) {
            const rawResponse = await ApiService.delete(`/v1/url-document/soft-delete/${documentId}`);
            const parsedResponse = rawResponse.data as BaseResponse;
            if (rawResponse.status === 200) {
                toast.success(parsedResponse.message);
                await this.fetchDocuments();
            }
        }
    }
});

function toCreateRequest(document: DocumentVo): DocumentCreateRequest {
    return {
        title: document.title,
        doc_id: document.docId.map((docIdVo) => ({
            id: docIdVo.id,
            signed_url: docIdVo.signedUrl
        })),
        form_attr: document.formAttr
    };
}

function toUpdateRequest(document: DocumentVo): DocumentUpdateRequest {
    return {
        url_doc_status: document.urlDocStatus
    };
}
