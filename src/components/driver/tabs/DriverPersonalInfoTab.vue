<script setup lang="ts">
import { ref, onMounted, type PropType, toRef, computed } from 'vue';
import type { DriverDocumentItemDto, DriverItemDto, DriverStepItemDto } from '@/contracts/response/DriverRelated.response';
import { useDriverStore } from '@/stores/driver';
import { useRouter } from 'vue-router';
import ApiService from '@/services/ApiService';
import Editor from '@tinymce/tinymce-vue'
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const nativeWindow = window

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true },
    statusProp: { type: Object as PropType<DriverStepItemDto>, required: true },
})
const driver = toRef(props, 'driverProp')
const status = toRef(props, 'statusProp')

const driverStore = useDriverStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const driverDocument = ref<DriverDocumentItemDto | null>()
const selfieIds = ref<Map<string, string>>(new Map())
const cvIds = ref<Map<string, string>>(new Map())
const passportIds = ref<Map<string, string>>(new Map())
const emirateIds = ref<Map<string, string>>(new Map())
const visaIds = ref<Map<string, string>>(new Map())

// Enums
const changeStatusEnums = ref(['rejected', 'approved']);

onMounted(async () => {
    await fetchData();
    await Promise.all([
        fetchSelfieId(),
        fetchCvId(),
        fetchPassportId(),
        fetchEmirateId(),
        fetchVisaId(),
    ])
});

const fetchData = async () => {
    driverDocument.value = await driverStore.retrieveLatestDocuments(driver.value.id)
};

const fetchSelfieId = async () => {
    let selfieIdRaw = driverDocument.value?.selfie_id || []
    for (let i = 0; i < selfieIdRaw.length; i++) {
        const element = selfieIdRaw[i];
        selfieIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchCvId = async () => {
    let cvIdRaw = driverDocument.value?.cv_id || []
    for (let i = 0; i < cvIdRaw.length; i++) {
        const element = cvIdRaw[i];
        cvIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchPassportId = async () => {
    let passportIdRaw = driverDocument.value?.photo_passport_id || []
    for (let i = 0; i < passportIdRaw.length; i++) {
        const element = passportIdRaw[i];
        passportIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchEmirateId = async () => {
    let emirateIdRaw = driverDocument.value?.emirates_id || []
    for (let i = 0; i < emirateIdRaw.length; i++) {
        const element = emirateIdRaw[i];
        emirateIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchVisaId = async () => {
    let visaIdRaw = driverDocument.value?.visa_residency || []
    for (let i = 0; i < visaIdRaw.length; i++) {
        const element = visaIdRaw[i];
        visaIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const handleImageClick = (url: string) => {
    if (!url) return
    window.open(url, '_blank')?.focus();
}

const dialogChangeNotes = ref(false);
const changeNotesFormData = ref({
    doc_title_notes: '',
    doc_notes: '',
});
const notificationData = ref({
    content: '',
    sendNotif: false,
});
const closeChangeNotes = () => {
    dialogChangeNotes.value = false;
    changeNotesFormData.value = {
        doc_title_notes: '',
        doc_notes: ''
    };
    notificationData.value = {
        content: '',
        sendNotif: false,
    }
};
const saveChangeNotes = async () => {
    if (!driverDocument.value) return;
    // const data = await driverStore.updateNote(driverDocument.value.id, {
    //     doc_title_notes: changeNotesFormData.value.doc_title_notes,
    //     doc_notes: changeNotesFormData.value.doc_notes
    // });
    // if (notificationData.value.sendNotif) {
    await notificationStore.sendNotification({
        driver_id: driver.value.id,
        user_id: authStore.user.uid,
        step: "step1",
        message: changeNotesFormData.value.doc_notes,
        title: changeNotesFormData.value.doc_title_notes,
        content: notificationData.value.content,
        status: status.value.status_step,
        withEmail: true,
    })
    // }
    // if (data) {
    await fetchData();
    // }
    closeChangeNotes();
};

const dialogChangeStatus = ref(false);
const changeStatusFormData = ref({
    doc_status: ''
});
const closeChangeStatus = () => {
    dialogChangeStatus.value = false;
    changeStatusFormData.value = {
        doc_status: ''
    };
};
const saveChangeStatus = async () => {
    if (!driverDocument.value) return;
    const data = await driverStore.updateStatus(driverDocument.value.id, {
        doc_status: changeStatusFormData.value.doc_status
    });
    if (data) {
        await fetchData();
    }
    closeChangeStatus();
};

</script>
<template>
    <div class="ma-4" v-if="driverDocument">
        <v-row>
            <v-col cols="12">
                <div class="d-flex justify-space-between mb-5">
                    <div class="details"></div>
                    <div class="actions d-flex gap-2">
                        <v-dialog v-model="dialogChangeNotes" max-width="1000">
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                    <v-icon class="mr-2">mdi-note</v-icon>Add Note
                                </v-btn>
                            </template>
                            <v-card width="100%">
                                <v-card-title class="pa-4 bg-secondary">
                                    <span class="title text-white">Add Note</span>
                                </v-card-title>
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1"
                                    :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white">To send notifications or intructions to the driver,
                                        fields or forms need to be
                                        correct.</span>
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" lazy-validation>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field variant="outlined" hide-details
                                                    v-model="changeNotesFormData.doc_title_notes"
                                                    label="Title"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Message" v-model="changeNotesFormData.doc_notes"
                                                    auto-grow variant="outlined" placeholder="Please fill lead message."
                                                    rows="2" color="primary" row-height="10" shaped
                                                    hide-details></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <Editor v-model="notificationData.content"
                                                    tinymce-script-src="/assets/js/tinymce/tinymce.min.js" :init="{
                                                        plugins: 'lists link image table code help wordcount'
                                                    }" />
                                            </v-col>
                                            <v-col cols="12">
                                                <v-checkbox v-model="notificationData.sendNotif"
                                                    label="Send notification also using email?"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeNotes">Cancel</v-btn>
                                    <v-btn color="secondary"
                                        :disabled="changeNotesFormData.doc_title_notes == '' || changeNotesFormData.doc_notes == ''"
                                        variant="flat" @click="saveChangeNotes">Send</v-btn>
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
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1"
                                    :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white">To change the form status so that the driver can
                                        proceed to the next
                                        step.</span>
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" lazy-validation>
                                        <v-row>
                                            <v-col cols="12" sm="12">
                                                <v-select variant="outlined" hide-details :items="changeStatusEnums"
                                                    v-model="changeStatusFormData.doc_status" label="Status"></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeStatus">Cancel</v-btn>
                                    <v-btn color="secondary" :disabled="changeStatusFormData.doc_status == ''"
                                        variant="flat" @click="saveChangeStatus">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-card elevation="10">
            <v-card-item>
                <v-row>
                    <v-col cols="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">High School</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Name" hide-details
                            :value="driverDocument.high_school" />
                    </v-col>
                    <v-col cols="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">University</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="University" hide-details
                            :value="driverDocument.university" />
                    </v-col>
                </v-row>
                <v-row>
                    <!-- Camera Upload -->
                    <v-col cols="12" md="4">
                        <v-card elevation="10">
                            <v-card-item>
                                <v-card-title class="text-h5">Camera</v-card-title>
                            </v-card-item>
                            <v-card-text>

                                <div class="mt-5">
                                    <v-row>
                                        <v-col cols="12" v-for="(item, k) in driverDocument.selfie_id"
                                            :key="`cam-item-${item.id}-${k}`">
                                            <v-img :src="selfieIds.get(item.id) || ''" aspect-ratio="1" height="150"
                                                @click="handleImageClick(selfieIds.get(item.id) || '')"></v-img>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-8">
            <v-card-item>
                <h2 class="mb-2 mt-4">Document Information</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">Document</th>
                            <th class="text-left">Type Visa</th>
                            <th class="text-left">Filename</th>
                            <th class="text-left">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, k) in driverDocument.cv_id" :key="`cv-item-${item.id}-${k}`">
                            <td>CV Document</td>
                            <td>CV Document</td>
                            <td>{{ item.signed_url }}</td>
                            <td>
                                <v-btn icon color="secondary" variant="flat" size="x-small"
                                    @click="nativeWindow.open(cvIds.get(item.id) || '', '_blank')">
                                    <ArrowDownCircleIcon size="16" />
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-for="(item, k) in driverDocument.photo_passport_id"
                            :key="`passport-item-${item.id}-${k}`">
                            <td>Passport</td>
                            <td>Passport</td>
                            <td>{{ item.signed_url }}</td>
                            <td>
                                <v-btn icon color="secondary" variant="flat" size="x-small"
                                    @click="nativeWindow.open(passportIds.get(item.id) || '', '_blank')">
                                    <ArrowDownCircleIcon size="16" />
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-for="(item, k) in driverDocument.emirates_id" :key="`emirate-item-${item.id}-${k}`">
                            <td>Emirates ID</td>
                            <td>Emirates ID</td>
                            <td>{{ item.signed_url }}</td>
                            <td>
                                <v-btn icon color="secondary" variant="flat" size="x-small"
                                    @click="nativeWindow.open(emirateIds.get(item.id) || '', '_blank')">
                                    <ArrowDownCircleIcon size="16" />
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-for="(item, k) in driverDocument.visa_residency" :key="`visa-item-${item.id}-${k}`">
                            <td>Current Visa</td>
                            <td>{{ driverDocument.visa_type }}</td>
                            <td>{{ item.signed_url }}</td>
                            <td>
                                <v-btn icon color="secondary" variant="flat" size="x-small"
                                    @click="nativeWindow.open(visaIds.get(item.id), '_blank')">
                                    <ArrowDownCircleIcon size="16" />
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>
    </div>
    <div v-else>
        <p>Documents is currently not available</p>
    </div>
</template>
