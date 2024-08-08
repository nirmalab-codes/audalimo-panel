<script setup lang="ts">
import type { DriverOfferLetterItemDto, DriverItemDto, DriverStepItemDto } from '@/contracts/response/DriverRelated.response';
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

const driverOfferLetter = ref<DriverOfferLetterItemDto | null>();
const letters = ref<Map<string, BufferedDocIdVo>>(new Map());

// Enums
const changeStatusEnums = ref(['rejected', 'approved']);

onMounted(async () => {
    await fetchData();
    await fetchLetters();
});

const fetchData = async () => {
    driverOfferLetter.value = await driverStore.retrieveLatestOfferLetter(driver.value.id);
};

const fetchLetters = async () => {
    let letterIdRaw = driverOfferLetter.value?.letter_id || [];
    for (let i = 0; i < letterIdRaw.length; i++) {
        const element = letterIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        letters.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const dialogChangeNotes = ref(false);
const changeNotesFormData = ref({
    letter_title_notes: '',
    letter_notes: ''
});
const notificationData = ref({
    content: '',
    sendNotif: false,
});
const closeChangeNotes = () => {
    dialogChangeNotes.value = false;
    changeNotesFormData.value = {
        letter_title_notes: '',
        letter_notes: ''
    };
    notificationData.value = {
        content: '',
        sendNotif: false,
    }
};
const saveChangeNotes = async () => {
    if (!driverOfferLetter.value) return;
    const data = await driverStore.updateOfferLetterNotes(driverOfferLetter.value.id, {
        letter_title_notes: changeNotesFormData.value.letter_title_notes,
        letter_notes: changeNotesFormData.value.letter_notes
    });
    if(notificationData.value.sendNotif){
        await notificationStore.sendNotification({
            driver_id: driver.value.id,
            user_id: authStore.user.uid,
            step: "step1",
            message: changeNotesFormData.value.letter_notes,
            title: changeNotesFormData.value.letter_title_notes,
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
    lo_status: ''
});
const closeChangeStatus = () => {
    dialogChangeStatus.value = false;
    changeStatusFormData.value = {
        lo_status: ''
    };
};
const saveChangeStatus = async () => {
    if (!driverOfferLetter.value) return;
    const data = await driverStore.updateOfferLetterStatus(driverOfferLetter.value.id, {
        lo_status: changeStatusFormData.value.lo_status
    });
    if (data) {
        await fetchData();
    }
    closeChangeStatus();
};
</script>

<template>
    <v-container v-if="driverOfferLetter">
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
                                                    v-model="changeNotesFormData.letter_title_notes"
                                                    label="Title"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea
                                                    label="Message"
                                                    v-model="changeNotesFormData.letter_notes"
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
                                        :disabled="changeNotesFormData.letter_title_notes == '' || changeNotesFormData.letter_notes == ''"
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
                                                    v-model="changeStatusFormData.lo_status"
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
                                        :disabled="changeStatusFormData.lo_status == ''"
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
        <h2 class="mb-2">Driver Letter Information</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Letter Status</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverOfferLetter?.letter_status" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">LO Status</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverOfferLetter?.lo_status" readonly />
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
                <tr v-for="(item, key) in Array.from(letters.entries())" :key="`letter-${item[1].id}-${key}`">
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
    <div v-else>Offer Letter is currently not available</div>
</template>