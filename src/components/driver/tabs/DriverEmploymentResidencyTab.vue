<script setup lang="ts">
import type { DriverEmploymentResidencyItemDto, DriverItemDto } from '@/contracts/response/DriverRelated.response';
import type { BufferedDocIdVo } from '@/contracts/vo/Document.vo';
import { getEnumKeyByEnumValue } from '@/enums/base';
import { UserGender } from '@/enums/UserRelated.enum';
import ApiService from '@/services/ApiService';
import { useDriverStore } from '@/stores/driver';
import { onMounted, type PropType, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowDownCircleIcon } from 'vue-tabler-icons';

const nativeWindow = window

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true }
})
const driver = toRef(props, 'driverProp')

const driverStore = useDriverStore();

const driverEmploymentResidency = ref<DriverEmploymentResidencyItemDto|null>()
const medicalInformations = ref<Map<string, BufferedDocIdVo>>(new Map())

onMounted(async () => {
    driverEmploymentResidency.value = await driverStore.retrieveLatestEmploymentResidency(driver.value.id)
});

const getFileName = (url: string): string => {
    return url.split('/').pop() || 'Unknown file';
};

const openDocument = (url: string): void => {
    window.open(url, '_blank');
};
</script>

<template>
    <v-container v-if="driverEmploymentResidency">
        <h2 class="mb-2">Employment Residency Information</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Driver Name</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Driver Name"
                    hide-details
                    :value="`${driverEmploymentResidency.driver.first_name} ${driverEmploymentResidency.driver.middle_name || ''} ${
                        driverEmploymentResidency.driver.last_name || ''
                    }`"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Email</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Email"
                    hide-details
                    :value="driverEmploymentResidency.driver.email"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Phone</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Phone"
                    hide-details
                    :value="driverEmploymentResidency.driver.phone"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Home Phone</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Home Phone"
                    hide-details
                    :value="driverEmploymentResidency.driver.phone_home"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Gender</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Gender"
                    hide-details
                    :value="driverEmploymentResidency.driver.gender === 1 ? 'Male' : 'Female'"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Date of Birth</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Date of Birth"
                    hide-details
                    :value="new Date(driverEmploymentResidency.driver.date_of_birth).toLocaleDateString()"
                    readonly
                />
            </v-col>
            <v-col cols="12" class="mb-1">
                <v-label class="font-weight-medium">Address</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Address"
                    hide-details
                    :value="driverEmploymentResidency.driver.address"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Nationality</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Nationality"
                    hide-details
                    :value="driverEmploymentResidency.driver.national"
                    readonly
                />
            </v-col>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Experience (years)</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Experience"
                    hide-details
                    :value="driverEmploymentResidency.driver.experience"
                    readonly
                />
            </v-col>
        </v-row>

        <h2 class="mb-2 mt-4">Document Status</h2>
        <v-row>
            <v-col cols="12" md="6" class="mb-1">
                <v-label class="font-weight-medium">Document Status</v-label>
                <v-text-field
                    variant="outlined"
                    type="text"
                    placeholder="Document Status"
                    hide-details
                    :value="driverEmploymentResidency.doc_status"
                    readonly
                />
            </v-col>
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

        <h2 class="mb-2 mt-4">Uploaded Documents</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Document Type</th>
                    <th class="text-left">File Name</th>
                    <th class="text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(doc, index) in driverEmploymentResidency.doc_papper_id" :key="`papper-${index}`">
                    <td>Paper ID</td>
                    <td>{{ getFileName(doc.signed_url) }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="openDocument(doc.signed_url)">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
                <tr v-for="(doc, index) in driverEmploymentResidency.doc_labor_id" :key="`labor-${index}`">
                    <td>Labor ID</td>
                    <td>{{ getFileName(doc.signed_url) }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="openDocument(doc.signed_url)">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
                <tr v-for="(doc, index) in driverEmploymentResidency.doc_contract_id" :key="`contract-${index}`">
                    <td>Contract ID</td>
                    <td>{{ getFileName(doc.signed_url) }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="openDocument(doc.signed_url)">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
                <tr v-for="(doc, index) in driverEmploymentResidency.english_id" :key="`english-${index}`">
                    <td>English Test</td>
                    <td>{{ getFileName(doc.signed_url) }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="openDocument(doc.signed_url)">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
                <tr v-for="(doc, index) in driverEmploymentResidency.police_id" :key="`police-${index}`">
                    <td>Police Clearance</td>
                    <td>{{ getFileName(doc.signed_url) }}</td>
                    <td>
                        <v-btn icon color="secondary" variant="flat" size="x-small" @click="openDocument(doc.signed_url)">
                            <ArrowDownCircleIcon size="16" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
    <div v-else>Employment Residency information is currently not available</div>
</template>
  