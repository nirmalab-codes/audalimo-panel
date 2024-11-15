<script setup lang="ts">
import type { DriverRtaItemDto, DriverItemDto, DriverStepItemDto } from '@/contracts/response/DriverRelated.response';
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

const driverRta = ref<DriverRtaItemDto | null>();
const medicalTests = ref<Map<string, BufferedDocIdVo>>(new Map());

// Enums
const changeStatusEnums = ref(['rejected', 'approved']);

onMounted(async () => {
    await fetchData();
    await fetchMedicalTests();
    await fetchSchedule();
});

const fetchData = async () => {
    driverRta.value = await driverStore.retrieveLatestRtaTraining(driver.value.id);
};

const fetchSchedule = async () => {
    if (!driverRta.value) return;
    changeScheduleFormData.value.training_start_date = driverRta.value.training_start_date;
    changeScheduleFormData.value.training_end_date = driverRta.value.training_end_date;
    changeScheduleFormData.value.training_start_time = driverRta.value.training_start_time;
    changeScheduleFormData.value.training_end_time = driverRta.value.training_end_time;
    changeScheduleFormData.value.training_location = driverRta.value.training_location;
}

const fetchMedicalTests = async () => {
    let medicalTestIdRaw = driverRta.value?.medical_test_id || [];
    for (let i = 0; i < medicalTestIdRaw.length; i++) {
        const element = medicalTestIdRaw[i];
        let urlSplit = element.signed_url.split('/');
        medicalTests.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        });
    }
};

const dialogChangeSchedule = ref(false);
const changeScheduleFormData: any = ref({
    training_start_date: '',
    training_end_date: '',
    training_start_time: '',
    training_end_time: '',
    training_location: ''
});

const saveChangeSchedule = async () => {
    if (!driverRta.value) return;
    await notificationStore.updateRtaTrainingSchedule(driverRta.value.id, {
        training_start_date: changeScheduleFormData.value.training_start_date,
        training_end_date: changeScheduleFormData.value.training_end_date,
        training_start_time: changeScheduleFormData.value.training_start_time,
        training_end_time: changeScheduleFormData.value.training_end_time,
        training_location: changeScheduleFormData.value.training_location,
    })
    await fetchData();
    closeChangeSchedule();
};

const closeChangeSchedule = () => {
    dialogChangeSchedule.value = false;
};
const dialogChangeNotes = ref(false);
const changeNotesFormData = ref({
    rta_title_notes: '',
    rta_notes: ''
});
const notificationData = ref({
    content: '',
    sendNotif: false,
});
const closeChangeNotes = () => {
    dialogChangeNotes.value = false;
    changeNotesFormData.value = {
        rta_title_notes: '',
        rta_notes: ''
    };
    notificationData.value = {
        content: '',
        sendNotif: false,
    }
};
const saveChangeNotes = async () => {
    if (!driverRta.value) return;
    // const data = await driverStore.updateRtaNotes(driverRta.value.id, {
    //     rta_title_notes: changeNotesFormData.value.rta_title_notes,
    //     rta_notes: changeNotesFormData.value.rta_notes
    // });
    // if (notificationData.value.sendNotif) {
    await notificationStore.sendNotification({
        driver_id: driver.value.id,
        user_id: authStore.user.uid,
        step: "step1",
        message: changeNotesFormData.value.rta_notes,
        title: changeNotesFormData.value.rta_title_notes,
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
    rta_status: ''
});
const closeChangeStatus = () => {
    dialogChangeStatus.value = false;
    changeStatusFormData.value = {
        rta_status: ''
    };
};
const saveChangeStatus = async () => {
    if (!driverRta.value) return;
    const data = await driverStore.updateRtaStatus(driverRta.value.id, {
        rta_status: changeStatusFormData.value.rta_status
    });
    if (data) {
        await fetchData();
    }
    closeChangeStatus();
};

// Utils
const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
    <v-container v-if="driverRta">
        <v-row>
            <v-col cols="12">
                <div class="d-flex justify-end">
                    <div class="actions d-flex gap-2">
                        <v-dialog v-model="dialogChangeSchedule" max-width="1000">
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                    <v-icon class="mr-2">mdi-calendar-account</v-icon>Change Schedule
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="pa-4 bg-secondary">
                                    <span class="title text-white">Change Schedule</span>
                                </v-card-title>
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1"
                                    :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white">You can change candidate schedule training.</span>
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" lazy-validation>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-text-field variant="outlined" type="date" hide-details
                                                    v-model="changeScheduleFormData.training_start_date"
                                                    label="Start Date"></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field variant="outlined" type="date" hide-details
                                                    v-model="changeScheduleFormData.training_end_date"
                                                    label="End Date"></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field variant="outlined" type="time" hide-details
                                                    v-model="changeScheduleFormData.training_start_time"
                                                    label="Start Time"></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field variant="outlined" type="time" hide-details
                                                    v-model="changeScheduleFormData.training_end_time"
                                                    label="End Time"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field variant="outlined" hide-details
                                                    v-model="changeScheduleFormData.training_location"
                                                    label="Training Location"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeSchedule">Cancel</v-btn>
                                    <v-btn color="secondary"
                                        :disabled="changeScheduleFormData.training_start_date == '' || changeScheduleFormData.training_end_date == '' || changeScheduleFormData.training_start_time == '' || changeScheduleFormData.training_end_time == '' || changeScheduleFormData.training_location == ''"
                                        variant="flat" @click="saveChangeSchedule">Save Schedule</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

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
                                                    v-model="changeNotesFormData.rta_title_notes"
                                                    label="Title"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Message" v-model="changeNotesFormData.rta_notes"
                                                    auto-grow variant="outlined" rows="2" color="primary"
                                                    row-height="10" shaped hide-details></v-textarea>
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
                                        :disabled="changeNotesFormData.rta_title_notes == '' || changeNotesFormData.rta_notes == ''"
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
                                                    v-model="changeStatusFormData.rta_status" label="Status"></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeStatus">Cancel</v-btn>
                                    <v-btn color="secondary" :disabled="changeStatusFormData.rta_status == ''"
                                        variant="flat" @click="saveChangeStatus">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
            </v-col>
        </v-row>

        <!-- <h2 class="mb-2">Driver RTA Information</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">RTA Status</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.rta_status" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">RTA Permit Status</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.rta_permit_status" readonly />
            </v-col>
        </v-row> -->
        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Training Information</h2>
                <v-row>
                    <v-col cols="12" md="3" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Training Start Date</v-label>
                        <v-text-field variant="outlined" type="text" hide-details
                            :value="formatDate(driverRta?.training_start_date)" readonly />
                    </v-col>
                    <v-col cols="12" md="3" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Training Start Time</v-label>
                        <v-text-field variant="outlined" type="text" hide-details
                            :value="formatTime(driverRta?.training_start_time)" readonly />
                    </v-col>
                    <v-col cols="12" md="3" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Training End Date</v-label>
                        <v-text-field variant="outlined" type="text" hide-details
                            :value="formatDate(driverRta?.training_end_date)" readonly />
                    </v-col>
                    <v-col cols="12" md="3" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Training End Time</v-label>
                        <v-text-field variant="outlined" type="text" hide-details
                            :value="formatTime(driverRta?.training_end_time)" readonly />
                    </v-col>
                    <v-col cols="12" md="12" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Training Location</v-label>
                        <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.training_location"
                            readonly />
                    </v-col>
                    <!-- <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">URL Location</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.url_location || 'N/A'" readonly />
            </v-col> -->
                </v-row>
            </v-card-item>
        </v-card>
        <!-- <h2 class="mb-2 mt-4">Medical Information</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Medical Status</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.medical_status" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Number of Medical Test Documents</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.medical_test_id.length" readonly />
            </v-col>
        </v-row>

        <h2 class="mb-2 mt-4">Links and Additional Information</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Link to Our Office</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.link_our_office || 'N/A'" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Link to Medical Test</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.link_medical_test || 'N/A'" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Link to RTA Test</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.link_rta_test || 'N/A'" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">RTA Permit ID</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.rta_permit_id || 'N/A'" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">RTA Title Notes</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.rta_title_notes || 'N/A'" readonly />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">RTA Notes</v-label>
                <v-text-field variant="outlined" type="text" hide-details :value="driverRta?.rta_notes || 'N/A'" readonly />
            </v-col>
        </v-row> -->

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Letter Documents</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">Filename</th>
                            <th class="text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in Array.from(medicalTests.entries())"
                            :key="`letter-${item[1].id}-${key}`">
                            <td>{{ item[1].name }}</td>
                            <td>
                                <v-btn icon color="secondary" variant="flat" size="x-small"
                                    @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                                    <ArrowDownCircleIcon size="16" />
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>

    </v-container>
    <div v-else>Offer Letter is currently not available</div>
</template>