<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import contact from '@/_mockApis/apps/contact';
import { useDriverStore } from '@/stores/driver';
import { storeToRefs } from 'pinia';

import VueAvatar from '@webzlodimir/vue-avatar';
import '@webzlodimir/vue-avatar/dist/style.css';

import countries from '@/utils/json/countries.json';
// const store = useContactStore();
const driverStore = useDriverStore();

const { driverList } = storeToRefs(driverStore);

onMounted(() => {
    // store.fetchContacts();
    driverStore.retrieveList();
});

function transformStatus(status: string): string {
    switch (status) {
        case 'OPEN':
        case 'PENDING':
            return 'NOT FILLED';
        case 'REVIEW':
            return 'NEED TO REVIEW';
        case 'APPROVED':
        case 'REJECTED':
            return status;
        default:
            return 'UNKNOWN';
    }
}

function processStepData(stepData: string): string {
    const [step, status] = stepData.split('-');
    if (stepData === 'STEP6-APPROVED') return 'VERIFIED';
    const transformedStatus = transformStatus(status as string);
    return `${step} - ${transformedStatus}`;
}

function processStepColor(stepData: string): string {
    const [step, status] = stepData.split('-');
    if (stepData === 'STEP6-APPROVED') return 'success';
    return getColor(status as string);
}

function getColor(status: string): string {
    switch (status) {
        case 'REVIEW':
            return 'warning';
        case 'APPROVED':
            return 'success';
        case 'REJECTED':
            return 'error';
        case 'UNKNOWN':
        default:
            return '';
    }
}

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const rolesbg = ref(['primary', 'secondary', 'error', 'success', 'warning']);
const desserts = ref(contact);
const editedIndex = ref(-1);
const editedItem = ref({
    new_password: '',
    confirm_new_password: '',
    is_active: false,
    date_of_birth: '',
    gender: null,
    national: '',
    experience: 0,
    is_verified: false,
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_home: '',
    phone: '',
    email: ''
});
const defaultItem = ref({
    new_password: '',
    confirm_new_password: '',
    is_active: false,
    date_of_birth: '',
    gender: null,
    national: '',
    experience: 0,
    is_verified: false,
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_home: '',
    phone: '',
    email: ''
});

//Methods
const filteredList = computed(() => {
    return driverList.value.filter((driver: any) => {
        return (
            driver.first_name?.toLowerCase().includes(search.value.toLowerCase()) ||
            driver.middle_name?.toLowerCase().includes(search.value.toLowerCase()) ||
            driver.last_name?.toLowerCase().includes(search.value.toLowerCase()) ||
            driver.phone?.toLowerCase().includes(search.value.toLowerCase()) ||
            driver.phone_home?.toLowerCase().includes(search.value.toLowerCase()) ||
            driver.email?.toLowerCase().includes(search.value.toLowerCase()) ||
            driver.status_step?.toLowerCase().includes(search.value.toLowerCase())
        );
    });
});

function close() {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value);
        editedIndex.value = -1;
    }, 300);
}
async function save() {
    await driverStore.createDriver(editedItem.value);
    driverStore.retrieveList();
    close();
}

//Computed Property
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'New Driver' : 'Edit Driver';
});
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Driver" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1024">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Driver
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="4" sm="4">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.first_name"
                                        label="First Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4" sm="4">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.middle_name"
                                        label="Middle Name (Optional)"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4" sm="4">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.last_name"
                                        label="Last Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.phone"
                                        label="Phone"
                                        type="tel"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        type="tel"
                                        v-model="editedItem.phone_home"
                                        label="Home Phone"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        type="date"
                                        v-model="editedItem.date_of_birth"
                                        label="Date of Birth"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        item-title="name"
                                        item-value="value"
                                        v-model="editedItem.gender"
                                        :items="[
                                            { name: 'Male', value: 1 },
                                            { name: 'Female', value: 0 }
                                        ]"
                                        label="Gender"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-autocomplete
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.national"
                                        label="National"
                                        :items="countries"
                                        item-title="nationality"
                                        item-value="nationality"
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.experience"
                                        label="Driving Experience"
                                        type="number"
                                        :min="0"
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.email"
                                        label="Email"
                                        type="email"
                                        autocomplete="email"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.new_password"
                                        label="New Password"
                                        type="password"
                                        autocomplete="new-password"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.confirm_new_password"
                                        label="Confirm New Password"
                                        type="password"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn
                            color="secondary"
                            :disabled="editedItem.first_name == '' || editedItem.email == ''"
                            variant="flat"
                            @click="save"
                            >Save</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">#</th>
                <th class="text-subtitle-1 font-weight-semibold">UserInfo</th>
                <th class="text-subtitle-1 font-weight-semibold">Phone</th>
                <th class="text-subtitle-1 font-weight-semibold">Joining Date</th>
                <th class="text-subtitle-1 font-weight-semibold">Status</th>
                <th class="text-subtitle-1 font-weight-semibold">Actions</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="filteredList.length === 0">
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="d-flex flex-column align-center py-8">
                            <h2 class="text-h4 mb-4">Nothing found </h2>
                            <p class="text-gray-600">
                                No item match your search criteria, please input different <br />keyword or refresh the page.
                            </p>
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="(item, k) in filteredList" :key="item.id">
                    <td class="text-subtitle-1">{{ k + 1 }}</td>
                <td>
                    <div class="d-flex align-center py-4">
                        <div>
                            <vue-avatar
                                v-if="item.first_name && item.last_name"
                                :username="`${item.first_name || ''} ${item.last_name || ''}`"
                            />
                            <vue-avatar v-else username="Unknown User" />
                        </div>

                        <div class="ml-5">
                            <h4 class="text-h6 font-weight-semibold">
                                {{ item.first_name || '' }} {{ item.middle_name || '' }} {{ item.last_name || '' }}
                            </h4>
                            <span class="text-subtitle-1 d-block mt-1 textSecondary">{{ item.email }}</span>
                        </div>
                    </div>
                </td>
                <td class="text-subtitle-1">{{ item.phone }}</td>
                <td class="text-subtitle-1">{{ new Date(item.created_at).toLocaleDateString() }}</td>
                <td>
                    <!-- <v-chip :color="item.rolestatus" size="small" label>{{ item.role }}</v-chip> -->
                    <v-chip :color="processStepColor(item.status_step)" size="small" label>
                        {{ processStepData(item.status_step) }}
                    </v-chip>
                </td>
                <td>
                    <div class="d-flex align-center">
                        <v-tooltip text="Detail">
                            <template v-slot:activator="{ props }">
                                <router-link :to="`/apps/driver/${item.id}`" v-bind="props">
                                    <v-btn icon flat>
                                        <FileInfoIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </router-link>
                            </template>
                        </v-tooltip>
                    </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </v-table>
</template>
