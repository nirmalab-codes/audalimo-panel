<script setup lang="ts">
import type { DriverEmploymentResidencyItemDto, DriverItemDto, DriverStepItemDto } from '@/contracts/response/DriverRelated.response';
import type { BufferedDocIdVo } from '@/contracts/vo/Document.vo';
import ApiService from '@/services/ApiService';
import { useDriverStore } from '@/stores/driver';
import { onMounted, type PropType, ref, toRef } from 'vue';
import { ArrowDownCircleIcon } from 'vue-tabler-icons';
import Editor from '@tinymce/tinymce-vue'
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';

const nativeWindow = window;

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true },
        statusProp: { type: Object as PropType<DriverStepItemDto>, required: true },
});
const driver = toRef(props, 'driverProp');
const status = toRef(props, 'statusProp')

const driverStore = useDriverStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const driverEmploymentResidency = ref<DriverEmploymentResidencyItemDto | null>();
const doc_papers = ref<Map<string, BufferedDocIdVo>>(new Map());
const doc_labors = ref<Map<string, BufferedDocIdVo>>(new Map());
const doc_contracts = ref<Map<string, BufferedDocIdVo>>(new Map());
const englishs = ref<Map<string, BufferedDocIdVo>>(new Map());
const polices = ref<Map<string, BufferedDocIdVo>>(new Map());

// Enums
const changeStatusEnums = ref(['rejected', 'approved']);

onMounted(async () => {
    await fetchData();
    await fetchPapers();
    await fetchLabors();
    await fetchContracts();
    await fetchEnglishs();
    await fetchPolices();
});

const fetchData = async () => {
    driverEmploymentResidency.value = await driverStore.retrieveLatestEmploymentResidency(driver.value.id);
};

const fetchPapers = async () => {
    let docPapperIdRaw = driverEmploymentResidency.value?.doc_papper_id || [];
    for (let i = 0; i < docPapperIdRaw.length; i++) {
        const element = docPapperIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        doc_papers.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const fetchLabors = async () => {
    let docLaborIdRaw = driverEmploymentResidency.value?.doc_labor_id || [];
    for (let i = 0; i < docLaborIdRaw.length; i++) {
        const element = docLaborIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        doc_labors.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const fetchContracts = async () => {
    let docContractIdRaw = driverEmploymentResidency.value?.doc_contract_id || [];
    for (let i = 0; i < docContractIdRaw.length; i++) {
        const element = docContractIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        doc_contracts.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const fetchEnglishs = async () => {
    let englishIdRaw = driverEmploymentResidency.value?.english_id || [];
    for (let i = 0; i < englishIdRaw.length; i++) {
        const element = englishIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        englishs.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const fetchPolices = async () => {
    let policeIdRaw = driverEmploymentResidency.value?.police_id || [];
    for (let i = 0; i < policeIdRaw.length; i++) {
        const element = policeIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        polices.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const dialogChangeNotes = ref(false);
const changeNotesFormData = ref({
    residency_title_notes: '',
    residency_notes: ''
});
const notificationData = ref({
    content: '',
    sendNotif: false,
});
const closeChangeNotes = () => {
    dialogChangeNotes.value = false;
    changeNotesFormData.value = {
        residency_title_notes: '',
        residency_notes: ''
    };
    notificationData.value = {
        content: '',
        sendNotif: false,
    }
};
const saveChangeNotes = async () => {
    if (!driverEmploymentResidency.value) return;
    const data = await driverStore.updateEmploymentResidencyNotes(driverEmploymentResidency.value.id, {
        residency_title_notes: changeNotesFormData.value.residency_title_notes,
        residency_notes: changeNotesFormData.value.residency_notes
    });
    if(notificationData.value.sendNotif){
        await notificationStore.sendNotification({
            driver_id: driver.value.id,
            user_id: authStore.user.uid,
            step: "step1",
            message: changeNotesFormData.value.residency_notes,
            title: changeNotesFormData.value.residency_title_notes,
            content: notificationData.value.content,
            status: status.value.status_step,
            withEmail: true,
        })
    }
    if (data) {
        await fetchData();
    }
    closeChangeNotes();
};

const dialogChangeStatus = ref(false);
const changeStatusFormData = ref({
    residency_status: ''
});
const closeChangeStatus = () => {
    dialogChangeStatus.value = false;
    changeStatusFormData.value = {
        residency_status: ''
    };
};
const saveChangeStatus = async () => {
    if (!driverEmploymentResidency.value) return;
    const data = await driverStore.updateEmploymentResidencyStatus(driverEmploymentResidency.value.id, {
        residency_status: changeStatusFormData.value.residency_status
    });
    if (data) {
        await fetchData();
    }
    closeChangeStatus();
};
</script>

<template>
    <v-container v-if="driverEmploymentResidency">
        <v-row>
            <v-col cols="12">
                <div class="d-flex justify-end">
                    <div class="actions d-flex gap-2">
                        <v-dialog v-model="dialogChangeNotes" max-width="1000">
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                    <v-icon class="mr-2">mdi-note</v-icon>Add Note
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="pa-4 bg-secondary">
                                    <span class="title text-white">Add Note</span>
                                </v-card-title>
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1" :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white"
                                        >To send notifications or intructions to the driver, fields or forms need to be correct.</span
                                    >
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" lazy-validation>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field
                                                    variant="outlined"
                                                    hide-details
                                                    v-model="changeNotesFormData.residency_title_notes"
                                                    label="Title"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea
                                                    label="Message"
                                                    v-model="changeNotesFormData.residency_notes"
                                                    auto-grow
                                                    variant="outlined"
                                                    rows="2"
                                                    color="primary"
                                                    row-height="10"
                                                    shaped
                                                    hide-details
                                                ></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <Editor
                                                    v-model="notificationData.content"
                                                    tinymce-script-src="/assets/js/tinymce/tinymce.min.js"
                                                    :init="{
                                                        plugins: 'lists link image table code help wordcount'
                                                    }"
                                                    />
                                            </v-col>
                                            <v-col cols="12">
                                                <v-checkbox v-model="notificationData.sendNotif" label="Send notification also using email?"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeNotes">Cancel</v-btn>
                                    <v-btn
                                        color="secondary"
                                        :disabled="changeNotesFormData.residency_title_notes == '' || changeNotesFormData.residency_notes == ''"
                                        variant="flat"
                                        @click="saveChangeNotes"
                                        >Save</v-btn
                                    >
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogChangeStatus" max-width="500">
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                    <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Change Status
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="pa-4 bg-secondary">
                                    <span class="title text-white">Change Status</span>
                                </v-card-title>
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1" :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white"
                                        >To change the form status so that the driver can proceed to the next step.</span
                                    >
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" lazy-validation>
                                        <v-row>
                                            <v-col cols="12" sm="12">
                                                <v-select
                                                    variant="outlined"
                                                    hide-details
                                                    :items="changeStatusEnums"
                                                    v-model="changeStatusFormData.residency_status"
                                                    label="Status"
                                                ></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeStatus">Cancel</v-btn>
                                    <v-btn
                                        color="secondary"
                                        :disabled="changeStatusFormData.residency_status == ''"
                                        variant="flat"
                                        @click="saveChangeStatus"
                                        >Save</v-btn
                                    >
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Document Status</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">English Test Status</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="English Test Status"
                    hide-details
                    :value="driverEmploymentResidency.english_status"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Police Status</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Police Status"
                    hide-details
                    :value="driverEmploymentResidency.police_status"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Residency Status</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Residency Status"
                    hide-details
                    :value="driverEmploymentResidency.residency_status ? 'Approved' : 'Pending'"
                    readonly
                />
            </v-col>
        </v-row>

        <h2 class="mb-2 mt-4">Documents</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Visit Permit</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Visit Permit"
                    hide-details
                    :value="driverEmploymentResidency.link_visit_permit || 'Not available'"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Amer Center</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Amer Center"
                    hide-details
                    :value="driverEmploymentResidency.link_amer_center || 'Not available'"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Emirates Bio</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Emirates Bio"
                    hide-details
                    :value="driverEmploymentResidency.link_emirates_bio || 'Not available'"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Labor</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Labor"
                    hide-details
                    :value="driverEmploymentResidency.link_labor || 'Not available'"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">English Test</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="English Test"
                    hide-details
                    :value="driverEmploymentResidency.link_english_test || 'Not available'"
                    readonly
                />
            </v-col>
        </v-row>

        <h2 class="mb-2 mt-4">Letter Documents</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Filename</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in Array.from(doc_papers.entries())" :key="`doc-paper-${item[1].id}-${key}`">
                    <td>{{ item[1].name }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <h2 class="mb-2 mt-4">Labor Documents</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Filename</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in Array.from(doc_labors.entries())" :key="`doc-labor-${item[1].id}-${key}`">
                    <td>{{ item[1].name }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <h2 class="mb-2 mt-4">Contract Documents</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Filename</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in Array.from(doc_contracts.entries())" :key="`doc-contract-${item[1].id}-${key}`">
                    <td>{{ item[1].name }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <h2 class="mb-2 mt-4">English Test Documents</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Filename</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in Array.from(englishs.entries())" :key="`english-${item[1].id}-${key}`">
                    <td>{{ item[1].name }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <h2 class="mb-2 mt-4">Police Clearance Documents</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Filename</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in Array.from(polices.entries())" :key="`police-${item[1].id}-${key}`">
                    <td>{{ item[1].name }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
    <div v-else>Employment Residency is currently not available</div>
</template>
