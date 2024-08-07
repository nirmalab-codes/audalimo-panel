<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useContactStore } from '@/stores/apps/contact';

import contact from '@/_mockApis/apps/contact';
import { useDriverStore } from '@/stores/driver';
import { storeToRefs } from 'pinia';

import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";

// const store = useContactStore();
const driverStore = useDriverStore();

const { driverList } = storeToRefs(driverStore)

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
    const transformedStatus = transformStatus(status as string);
    return `${step} - ${transformedStatus}`;
}

function processStepColor(stepData: string): string {
    const [step, status] = stepData.split('-');
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
    id: '',
    avatar: '1.jpg',
    userinfo: '',
    usermail: '',
    phone: '',
    jdate: '',
    role: '',
    rolestatus: ''
});
const defaultItem = ref({
    id: '',
    avatar: '1.jpg',
    userinfo: '',
    usermail: '',
    phone: '',
    jdate: '',
    role: '',
    rolestatus: ''
});

//Methods
const filteredList = computed(() => {
    return driverList.value.filter((driver: any) => {
        return driver.first_name?.toLowerCase().includes(search.value.toLowerCase())
            || driver.middle_name?.toLowerCase().includes(search.value.toLowerCase())
            || driver.last_name?.toLowerCase().includes(search.value.toLowerCase())
            || driver.phone?.toLowerCase().includes(search.value.toLowerCase())
            || driver.phone_home?.toLowerCase().includes(search.value.toLowerCase())
            || driver.email?.toLowerCase().includes(search.value.toLowerCase())
            || driver.status_step?.toLowerCase().includes(search.value.toLowerCase())
    });
});

function close() {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value);
        editedIndex.value = -1;
    }, 300);
}
function save() {
    if (editedIndex.value > -1) {
        Object.assign(desserts.value[editedIndex.value], editedItem.value);
    } else {
        desserts.value.push(editedItem.value);
    }
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
            <v-text-field density="compact" v-model="search" label="Search Driver" hide-details
                variant="outlined"></v-text-field>
        </v-col>
        <!-- <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
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
                <v-col cols="12" sm="6">
                    <v-text-field variant="outlined" hide-details v-model="editedItem.id" label="Id"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field variant="outlined" hide-details v-model="editedItem.userinfo"
                        label="User info"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field variant="outlined" hide-details v-model="editedItem.usermail" label="User email"
                        type="email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field variant="outlined" hide-details v-model="editedItem.phone" label="Phone"
                        type="phone"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field variant="outlined" hide-details v-model="editedItem.jdate"
                        label="Joining Date"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field variant="outlined" hide-details v-model="editedItem.role" label="Role"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                    <v-select variant="outlined" hide-details :items="rolesbg" v-model="editedItem.rolestatus"
                        label="Role Background"></v-select>
                </v-col>
            </v-row>
        </v-form>
    </v-card-text>

    <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close">Cancel</v-btn>
        <v-btn color="secondary" :disabled="editedItem.userinfo == '' || editedItem.usermail == ''" variant="flat"
            @click="save">Save</v-btn>
    </v-card-actions>
</v-card>
</v-dialog>
</v-col> -->
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
            <tr v-for="(item, k) in filteredList" :key="item.id">
                <td class="text-subtitle-1">{{ k + 1 }}</td>
                <td>
                    <div class="d-flex align-center py-4">
                        <div>
                            <vue-avatar v-if="item.first_name && item.last_name"
                                :username="`${item.first_name || ''} ${item.last_name || ''}`" />
                            <vue-avatar v-else username="Unknown User" />
                        </div>

                        <div class="ml-5">
                            <h4 class="text-h6 font-weight-semibold">{{ item.first_name || '' }} {{ item.middle_name
                                ||''}}
                                {{ item.last_name || '' }}</h4>
                            <span class="text-subtitle-1 d-block mt-1 textSecondary">{{ item.email }}</span>
                        </div>
                    </div>
                </td>
                <td class="text-subtitle-1">{{ item.phone }}</td>
                <td class="text-subtitle-1">{{ (new Date(item.created_at)).toLocaleDateString() }}</td>
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
        </tbody>
    </v-table>
</template>
