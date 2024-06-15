import { defineStore } from 'pinia';
// project imports
import { type DocumentListResponse } from '@/contracts/response/DocumentRelated.response';
import { type DocumentVo } from '@/contracts/vo/Document.vo';
import ApiService from '@/services/ApiService';
import { FormAttr } from '@/enums/DocumentRelated.enum';
import { type DocumentCreateRequest, type DocumentUpdateRequest } from '@/contracts/request/DocumentRelated.request';

export const useDocumentStore = defineStore({
    id: 'Document',
    state: () => ({
        documents: [] as Array<DocumentVo>
    }),
    getters: {},
    actions: {
        async fetchDocuments() {
            const rawResponse = await ApiService.get('/document');
            const parsedResponse = rawResponse.data as DocumentListResponse;
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
            const response = await ApiService.post('/document', request);
            if (response.status === 201) {
                await this.fetchDocuments();
            }
        },
        async updateDocument(document: DocumentVo) {
            const request = toUpdateRequest(document);
            const response = await ApiService.put(`/document/${document.id}`, request);
            if (response.status === 200) {
                await this.fetchDocuments();
            }
        },
        async deleteDocument(documentId: string) {
            const response = await ApiService.delete(`/document/soft-delete/${documentId}`);
            if (response.status === 200) {
                await this.fetchDocuments();
            }
        }
    }
});

function toCreateRequest(document: DocumentVo): DocumentCreateRequest {
    return {
        title: document.title,
        doc_id: document.docId.map(docIdVo => ({
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