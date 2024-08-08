<script setup lang="ts">
import type { DriverApplicationFormItemDto, DriverItemDto, DriverStepItemDto } from '@/contracts/response/DriverRelated.response';
import type { BufferedDocIdVo } from '@/contracts/vo/Document.vo';
import { getEnumKeyByEnumValue } from '@/enums/base';
import { UserGender } from '@/enums/UserRelated.enum';
import ApiService from '@/services/ApiService';
import { useAuthStore } from '@/stores/auth';
import { useDriverStore } from '@/stores/driver';
import { useNotificationStore } from '@/stores/notification';
import { onMounted, type PropType, ref, toRef } from 'vue';
import { ArrowDownCircleIcon } from 'vue-tabler-icons';
import Editor from '@tinymce/tinymce-vue'

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

const driverApplicationForm = ref<DriverApplicationFormItemDto | null>()
const medicalInformations = ref<Map<string, BufferedDocIdVo>>(new Map())

// Enums
const changeStatusEnums = ref(['rejected', 'approved']);

onMounted(async () => {
    await fetchData();
    await fetchMedicalInformations();
});

const fetchData = async () => {
    driverApplicationForm.value = await driverStore.retrieveLatestApplicationForm(driver.value.id)
};

const fetchMedicalInformations = async () => {
    let medicalIdRaw = driverApplicationForm.value?.medical_form_id || []
    for (let i = 0; i < medicalIdRaw.length; i++) {
        const element = medicalIdRaw[i];
        let urlSplit = element.signed_url.split('/')
        medicalInformations.value.set(element.id, {
            id: element.id,
            signedUrl: element.signed_url,
            byteUrl: await ApiService.bufferAsByteUrl(element.signed_url),
            name: urlSplit[urlSplit.length - 1]
        })
    }
}

const dialogChangeNotes = ref(false);
const changeNotesFormData = ref({
    application_title_notes: '',
    application_notes: ''
});
const notificationData = ref({
    content: '',
    sendNotif: false,
});
const closeChangeNotes = () => {
    dialogChangeNotes.value = false;
    changeNotesFormData.value = {
        application_title_notes: '',
        application_notes: ''
    };
    notificationData.value = {
        content: '',
        sendNotif: false,
    }
};
const saveChangeNotes = async () => {
    if (!driverApplicationForm.value) return;
    const data = await driverStore.updateApplicationFormNotes(driverApplicationForm.value.id, {
        application_title_notes: changeNotesFormData.value.application_title_notes,
        application_notes: changeNotesFormData.value.application_notes
    });
    if (notificationData.value.sendNotif) {
        await notificationStore.sendNotification({
            driver_id: driver.value.id,
            user_id: authStore.user.uid,
            step: "step1",
            message: changeNotesFormData.value.application_notes,
            title: changeNotesFormData.value.application_title_notes,
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
    application_status: ''
});
const closeChangeStatus = () => {
    dialogChangeStatus.value = false;
    changeStatusFormData.value = {
        application_status: ''
    };
};
const saveChangeStatus = async () => {
    if (!driverApplicationForm.value) return;
    const data = await driverStore.updateApplicationFormStatus(driverApplicationForm.value.id, {
        application_status: changeStatusFormData.value.application_status
    });
    if (data) {
        await fetchData();
    }
    closeChangeStatus();
};
</script>
<template>
    <v-container v-if="driverApplicationForm">
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
                                                    v-model="changeNotesFormData.application_title_notes"
                                                    label="Title"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Message"
                                                    v-model="changeNotesFormData.application_notes" auto-grow
                                                    variant="outlined" rows="2" color="primary" row-height="10" shaped
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
                                        :disabled="changeNotesFormData.application_title_notes == '' || changeNotesFormData.application_notes == ''"
                                        variant="flat" @click="saveChangeNotes">Save</v-btn>
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
                                                    v-model="changeStatusFormData.application_status"
                                                    label="Status"></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeStatus">Cancel</v-btn>
                                    <v-btn color="secondary" :disabled="changeStatusFormData.application_status == ''"
                                        variant="flat" @click="saveChangeStatus">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
            </v-col>
        </v-row>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2">Personal Information</h2>
                <v-row>
                    <v-col cols="12" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Name" hide-details
                            :value="driverApplicationForm?.job_fullname" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Place & date of birth</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Date of birth" hide-details
                            :value="`${driverApplicationForm?.job_place_birth}, ${new Date(driverApplicationForm?.job_date_birth).toLocaleDateString()}`" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Age</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Age" hide-details
                            :value="driverApplicationForm?.job_age" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Gender</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Gender" hide-details
                            :value="getEnumKeyByEnumValue(UserGender, driverApplicationForm?.job_gender)" />
                    </v-col>
                    <v-col cols="12" md="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">ID Number</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="ID Number" hide-details
                            :value="driverApplicationForm?.job_passport_number" />
                    </v-col>
                    <v-col cols="12" md="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Nationality</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Nationality" hide-details
                            :value="driverApplicationForm?.job_nation" />
                    </v-col>
                    <v-col cols="12" md="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Contact Phone</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Contact Phone" hide-details
                            :value="driverApplicationForm?.cn_mobile" />
                    </v-col>
                    <v-col cols="12" md="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Contact Home</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Contact Home" hide-details
                            :value="driverApplicationForm?.cn_home" />
                    </v-col>
                    <v-col cols="12" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Religion</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Religion" hide-details
                            :value="driverApplicationForm?.job_religion" />
                    </v-col>
                    <v-col cols="12" md="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Father Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Father Name" hide-details
                            :value="driverApplicationForm?.job_fathername" />
                    </v-col>
                    <v-col cols="12" md="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Mother Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Mother Name" hide-details
                            :value="driverApplicationForm?.job_mothername" />
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Company Information</h2>
                <v-row>
                    <v-col cols="12" class="mb-3">
                        <v-label class="mb-2 font-weight-medium">Company Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Company Name" hide-details
                            :value="driverApplicationForm?.job_name_company" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Current Job</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details
                            :value="driverApplicationForm?.job_present" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Current Position</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details
                            :value="driverApplicationForm?.job_position" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Current Division</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details
                            :value="driverApplicationForm?.job_division" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Join Date</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details
                            :value="new Date(driverApplicationForm?.job_date_join).toLocaleDateString()" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Place Issue</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details
                            :value="driverApplicationForm?.job_place_issue" />
                    </v-col>
                    <v-col cols="12" md="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Expiry</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details
                            :value="new Date(driverApplicationForm?.job_date_expiry).toLocaleDateString()" />
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Emergency Information</h2>
                <v-row>
                    <v-col cols="12" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Name" hide-details
                            :value="driverApplicationForm?.cp_emergency_name" />
                    </v-col>
                    <v-col cols="12" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Phone Number</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Phone Number" hide-details
                            :value="driverApplicationForm?.cp_emergency_number" />
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Contact Person in Dubai in Case of Emergency</h2>
                <h3 class="mb-2">First Person</h3>
                <v-row>
                    <v-col cols="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Name" hide-details
                            :value="driverApplicationForm?.cpd_first_fullname" />
                    </v-col>
                    <v-col cols="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Phone</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details
                            :value="driverApplicationForm?.cpd_first_phone" />
                    </v-col>
                    <v-col cols="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Mobile</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Mobile" hide-details
                            :value="driverApplicationForm?.cpd_first_mobile" />
                    </v-col>
                </v-row>
                <h3 class="mb-2 mt-2">Second Person</h3>
                <v-row>
                    <v-col cols="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Name" hide-details
                            :value="driverApplicationForm?.cpd_second_fullname" />
                    </v-col>
                    <v-col cols="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Phone</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details
                            :value="driverApplicationForm?.cpd_second_phone" />
                    </v-col>
                    <v-col cols="4" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Mobile</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Mobile" hide-details
                            :value="driverApplicationForm?.cpd_second_mobile" />
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Declaration for NEXT OF KIN</h2>
                <v-row>
                    <v-col cols="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Person Name</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Person Name" hide-details
                            :value="driverApplicationForm?.dnok_name" />
                    </v-col>
                    <v-col cols="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Person Relationship</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details
                            :value="driverApplicationForm?.dnok_relationship" />
                    </v-col>
                    <v-col cols="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Phone</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details
                            :value="driverApplicationForm?.dnok_phone" />
                    </v-col>
                    <v-col cols="6" class="mb-1">
                        <v-label class="mb-2 font-weight-medium">Mobile</v-label>
                        <v-text-field variant="outlined" type="text" placeholder="Mobile" hide-details
                            :value="driverApplicationForm?.dnok_mobile" />
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Data of Dependent</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Relationship</th>
                            <th class="text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in driverApplicationForm.dod" :key="`dod-${item.name_dependent}-${key}`">
                            <td>{{ item.name_dependent }}</td>
                            <td>{{ item.relationship_dependent }}</td>
                            <td>{{ new Date(item.date_dependent).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Education</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">School Name</th>
                            <th class="text-left">Subject</th>
                            <th class="text-left">Address</th>
                            <th class="text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in driverApplicationForm.equalification"
                            :key="`education-${item.name_course}-${key}`">
                            <td>{{ item.name_school }}</td>
                            <td>{{ item.name_course }}</td>
                            <td>{{ item.address_education }}</td>
                            <td>{{ new Date(item.date_education).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Employment History</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">Company Name</th>
                            <th class="text-left">Country</th>
                            <th class="text-left">Position</th>
                            <th class="text-left">Responsibility</th>
                            <th class="text-left">Start Date</th>
                            <th class="text-left">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in driverApplicationForm.employ_history"
                            :key="`employ-history-${item.name_company}-${key}`">
                            <td>{{ item.name_company }}</td>
                            <td>{{ item.country_employ }}</td>
                            <td>{{ item.position_employ }}</td>
                            <td>{{ item.job_responsibility }}</td>
                            <td>{{ new Date(item.start_employ).toLocaleDateString() }}</td>
                            <td>{{ new Date(item.end_employ).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Training</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">Course Title</th>
                            <th class="text-left">Training Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in driverApplicationForm.train_attend"
                            :key="`training-${item.course_title}-${key}`">
                            <td>{{ item.course_title }}</td>
                            <td>{{ new Date(item.date_training).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Language</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">School Name</th>
                            <th class="text-left">Language</th>
                            <th class="text-left">Address</th>
                            <th class="text-left">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in driverApplicationForm.langprof"
                            :key="`language-${item.name_course}-${key}`">
                            <td>{{ item.name_school }}</td>
                            <td>{{ item.name_course }}</td>
                            <td>{{ item.address_education }}</td>
                            <td>{{ item.level }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>

        <v-card elevation="10" class="mt-4">
            <v-card-item>
                <h2 class="mb-2 mt-4">Medical Information</h2>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">Filename</th>
                            <th class="text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in Array.from(medicalInformations.entries())"
                            :key="`medical-info-${item[1].id}-${key}`">
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
    <div v-else>Application Form is currently not available</div>
</template>
