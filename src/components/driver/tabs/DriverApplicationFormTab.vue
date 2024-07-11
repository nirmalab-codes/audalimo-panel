<script setup lang="ts">
import type { DriverApplicationFormItemDto, DriverItemDto } from '@/contracts/response/DriverRelated.response';
import type { BufferedDocIdVo } from '@/contracts/vo/Document.vo';
import { getEnumKeyByEnumValue } from '@/enums/base';
import { UserGender } from '@/enums/UserRelated.enum';
import ApiService from '@/services/ApiService';
import { useDriverStore } from '@/stores/driver';
import { onMounted, type PropType, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowDownCircleIcon } from 'vue-tabler-icons';

const router = useRouter()
const nativeWindow = window

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true }
})
const driver = toRef(props, 'driverProp')

const driverStore = useDriverStore();

const driverApplicationForm = ref<DriverApplicationFormItemDto|null>()
const medicalInformations = ref<Map<string, BufferedDocIdVo>>(new Map())

onMounted(async () => {
    driverApplicationForm.value = await driverStore.retrieveLatestApplicationForm(driver.value.id)
    await Promise.all([
        fetchMedicalInformations(),
    ])
});

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
</script>
<template>
    <form v-if="driverApplicationForm">
        <h2 class="mb-2">Personal Information</h2>
        <v-row>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Name" hide-details :value="driverApplicationForm?.job_fullname"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Place & date of birth</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Date of birth" hide-details :value="`${driverApplicationForm?.job_place_birth}, ${new Date(driverApplicationForm?.job_date_birth).toLocaleDateString()}`"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Age</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Age" hide-details :value="driverApplicationForm?.job_age"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Gender</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Gender" hide-details :value="getEnumKeyByEnumValue(UserGender, driverApplicationForm?.job_gender)"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class=" font-weight-medium">ID Number</v-label>
                <v-text-field variant="outlined" type="text" placeholder="ID Number" hide-details :value="driverApplicationForm?.job_passport_number"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class=" font-weight-medium">Nationality</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Nationality" hide-details :value="driverApplicationForm?.job_nation"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class=" font-weight-medium">Contact Phone</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Contact Phone" hide-details :value="driverApplicationForm?.cn_mobile"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class=" font-weight-medium">Contact Home</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Contact Home" hide-details :value="driverApplicationForm?.cn_home"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Religion</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Religion" hide-details :value="driverApplicationForm?.job_religion"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class=" font-weight-medium">Father Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Father Name" hide-details :value="driverApplicationForm?.job_fathername"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class=" font-weight-medium">Mother Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Mother Name" hide-details :value="driverApplicationForm?.job_mothername"/>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Company Information</h2>
        <v-row>
            <v-col cols="12" class="mb-3">
                <v-label class=" font-weight-medium">Company Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Company Name" hide-details :value="driverApplicationForm?.job_name_company"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Current Job</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_present"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Current Position</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_position"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Current Division</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_division"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Join Date</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="new Date(driverApplicationForm?.job_date_join).toLocaleDateString()"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Place Issue</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_place_issue"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-1">
                <v-label class=" font-weight-medium">Expiry</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="new Date(driverApplicationForm?.job_date_expiry).toLocaleDateString()"/>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Emergency Information</h2>
        <v-row>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Name" hide-details :value="driverApplicationForm?.cp_emergency_name"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Phone Number</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Phone Number" hide-details :value="driverApplicationForm?.cp_emergency_number"/>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Contact Person in Dubai in Case of Emergency</h2>
        <h3 class="mb-2">First Person</h3>
        <v-row>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Name" hide-details :value="driverApplicationForm?.cpd_first_fullname"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Phone</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details :value="driverApplicationForm?.cpd_first_phone"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Mobile</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Mobile" hide-details :value="driverApplicationForm?.cpd_first_mobile"/>
            </v-col>
        </v-row>
        <h3 class="mb-2 mt-2">Second Person</h3>
        <v-row>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Name" hide-details :value="driverApplicationForm?.cpd_second_fullname"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Phone</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details :value="driverApplicationForm?.cpd_second_phone"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Mobile</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Mobile" hide-details :value="driverApplicationForm?.cpd_second_mobile"/>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Declaration for NEXT OF KIN</h2>
        <v-row>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Person Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Person Name" hide-details :value="driverApplicationForm?.dnok_name"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Person Relationship</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details :value="driverApplicationForm?.dnok_relationship"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Phone</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Phone" hide-details :value="driverApplicationForm?.dnok_phone"/>
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class=" font-weight-medium">Mobile</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Mobile" hide-details :value="driverApplicationForm?.dnok_mobile"/>
            </v-col>
        </v-row>
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
            <tr
                v-for="(item,key) in driverApplicationForm.dod"
                :key="`dod-${item.name_dependent}-${key}`"
            >
                <td>{{ item.name_dependent }}</td>
                <td>{{ item.relationship_dependent }}</td>
                <td>{{ new Date(item.date_dependent).toLocaleDateString() }}</td>
            </tr>
            </tbody>
        </v-table>
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
            <tr
                v-for="(item,key) in driverApplicationForm.equalification"
                :key="`education-${item.name_course}-${key}`"
            >
                <td>{{ item.name_school }}</td>
                <td>{{ item.name_course }}</td>
                <td>{{ item.address_education }}</td>
                <td>{{ new Date(item.date_education).toLocaleDateString() }}</td>
            </tr>
            </tbody>
        </v-table>
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
            <tr
                v-for="(item,key) in driverApplicationForm.employ_history"
                :key="`employ-history-${item.name_company}-${key}`"
            >
                <td>{{ item.name_company }}</td>
                <td>{{ item.country_employ }}</td>
                <td>{{ item.position_employ }}</td>
                <td>{{ item.job_responsibility }}</td>
                <td>{{ new Date(item.start_employ).toLocaleDateString() }}</td>
                <td>{{ new Date(item.end_employ).toLocaleDateString() }}</td>
            </tr>
            </tbody>
        </v-table>
        <h2 class="mb-2 mt-4">Training</h2>
        <v-table>
            <thead>
            <tr>
                <th class="text-left">Course Title</th>
                <th class="text-left">Training Date</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(item,key) in driverApplicationForm.train_attend"
                :key="`training-${item.course_title}-${key}`"
            >
                <td>{{ item.course_title }}</td>
                <td>{{ new Date(item.date_training).toLocaleDateString() }}</td>
            </tr>
            </tbody>
        </v-table>
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
            <tr
                v-for="(item,key) in driverApplicationForm.langprof"
                :key="`language-${item.name_course}-${key}`"
            >
                <td>{{ item.name_school }}</td>
                <td>{{ item.name_course }}</td>
                <td>{{ item.address_education }}</td>
                <td>{{ item.level }}</td>
            </tr>
            </tbody>
        </v-table>
        <h2 class="mb-2 mt-4">Medical Information</h2>
        <v-table>
            <thead>
            <tr>
                <th class="text-left">Filename</th>
                <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(item,key) in Array.from(medicalInformations.entries())"
                :key="`medical-info-${item[1].id}-${key}`"
            >
                <td>{{ item[1].name }}</td>
                <td>
                    <v-btn icon color="secondary" variant="flat" size="x-small" @click="nativeWindow.open(item[1].byteUrl, '_blank')">
                        <ArrowDownCircleIcon size="16" />
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>
    </form>
    <div v-else>Application Form is currently not available</div>
</template>
