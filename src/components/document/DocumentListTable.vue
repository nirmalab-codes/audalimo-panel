<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDocumentStore } from '@/stores/apps/document';
import { useUploadStore } from '@/stores/apps/upload';
import { getDefaultDocumentVo, type DocumentVo, type DocIdVo } from '@/contracts/vo/Document.vo';
import { FormAttr } from '@/enums/DocumentRelated.enum';
import { type UploadDto } from '@/contracts/response/UploadRelated.response';

const store = useDocumentStore();
const uploadStore = useUploadStore();
const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const defaultItem = ref<DocumentVo>(getDefaultDocumentVo());
const editedItem = ref<DocumentVo>(defaultItem.value);
const fileToUpload = ref<File | null>(null);

onMounted(() => {
    store.fetchDocuments()
});

// Computed
const documents = computed(() => store.documents);
const formTitle = computed(() => editedItem.value.id ? 'Edit Document' : 'New Document');
const filteredList = computed(() => documents.value.filter(document => document.title.toLowerCase().includes(search.value.toLowerCase())));
const formAttrItems = computed(() => Object.values(FormAttr));

//Methods
const resetEditedItem = () => {
    editedItem.value = { ...defaultItem.value };
    isEdit.value = false;
    fileToUpload.value = null;
};

function editItem(document: DocumentVo) {
    editedItem.value = { ...document };
    isEdit.value = true;
    dialog.value = true;
}

async function deleteItem(document: DocumentVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteDocument(document.id);
    }
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        resetEditedItem()
    }, 300);
}

// xxx
async function save() {
    if (fileToUpload.value) {
        const uploadResponse: UploadDto | null = await uploadStore.upload(fileToUpload.value);

        if (uploadResponse) {
            const docId: DocIdVo = {
                id: uploadResponse.id,
                signedUrl: uploadResponse.signed_url
            };
            editedItem.value.docId[0] = docId;

            if (isEdit.value) {
                console.log('Updated document: ', editedItem.value);
                await store.updateDocument(editedItem.value);
            } else {
                console.log('Created document: ', editedItem.value);
                await store.createDocument(editedItem.value);
            }
        }
        return close();
    } else if (isEdit.value) {
        console.log('Updated document: ', editedItem.value);
        await store.updateDocument(editedItem.value);
        return close();
    }
}

function onFileChange(e: any) {
    fileToUpload.value = e.target.files[0];
}

async function openFile(document: DocumentVo) {
    if (document.docId.length === 0) {
        return;
    }
    const docIdSignedUrl = document.docId[0].signedUrl;
    window.open(docIdSignedUrl, '_blank');
}
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Document" hide-details
                variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto" @click="resetEditedItem">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Document
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.title"
                                        label="Title"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-file-input label="File input" density="compact" variant="outlined"
                                        @change="onFileChange"></v-file-input>
                                </v-col>
                                <v-col cols="12">
                                    <v-select variant="outlined" hide-details :items="formAttrItems"
                                        v-model="editedItem.formAttr" label="Form Attribute" required></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-checkbox v-model="editedItem.urlDocStatus" label="Visible"
                                        hide-details></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn color="secondary" :disabled="!editedItem.title || !editedItem.formAttr" variant="flat"
                            @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">Title</th>
                <th class="text-subtitle-1 font-weight-semibold">Form Attr</th>
                <th class="text-subtitle-1 font-weight-semibold">Visible</th>
                <th class="text-subtitle-1 font-weight-semibold">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in filteredList" :key="item.id">
                <td class="text-subtitle-1">{{ item.title }}</td>
                <td class="text-subtitle-1">{{ item.formAttr }}</td>
                <td>
                    <v-chip :color="item.urlDocStatus ? 'success' : 'warning'" size="small" label>{{ item.urlDocStatus
                        }}</v-chip>
                </td>
                <td>
                    <div class="d-flex align-center">
                        <v-tooltip text="Open">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="openFile(item)" v-bind="props">
                                    <DownloadIcon stroke-width="1.5" size="20" class="text-success" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Edit">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="editItem(item)" v-bind="props">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Delete">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="deleteItem(item)" v-bind="props">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
