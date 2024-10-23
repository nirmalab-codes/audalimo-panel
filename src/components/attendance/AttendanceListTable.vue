<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAttendanceStore } from '@/stores/apps/attendance';
import { type AttendanceVo, getDefaultAttendanceVo } from '@/contracts/vo/Attendance.vo';
import { useDriverStore } from '@/stores/driver';
import { useUploadStore } from '@/stores/apps/upload';
import { format } from 'date-fns'; // Import date-fns or any date formatting library

const store = useAttendanceStore();
const driverStore = useDriverStore();

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const defaultItem = ref<AttendanceVo>(getDefaultAttendanceVo());
const editedItem = ref<AttendanceVo>(defaultItem.value);

onMounted(() => {
    driverStore.retrieveAllVerifiedDrivers();
    store.fetchAttendances();
});

// Computed
const attendances = computed(() => store.attendances);
const drivers = computed(() => driverStore.verifiedDrivers);
const formTitle = computed(() => (editedItem.value.id ? 'Edit Attendance' : 'New Attendance'));
const filteredList = computed(() =>
    attendances.value.filter((attendance: AttendanceVo) => attendance.driver.first_name.toLowerCase().includes(search.value.toLowerCase()))
);
const fileToUpload = ref<File | null>(null);
const uploadStore = useUploadStore();

//Methods
const resetEditedItem = () => {
    driverStore.retrieveAllVerifiedDrivers();
    editedItem.value = { ...defaultItem.value };
    isEdit.value = false;
};

function editItem(attendance: AttendanceVo) {
    editedItem.value = { ...attendance };
    isEdit.value = true;
    dialog.value = true;
}

async function deleteItem(attendance: AttendanceVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteAttendance(attendance.id);
    }
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        resetEditedItem();
    }, 300);
}

async function save() {
    if (isEdit.value) {
        console.log('Updated document: ', editedItem.value);
        await store.updateAttendance(editedItem.value);
    } else {
        console.log('Created document: ', editedItem.value);
        await store.createAttendance(editedItem.value);
    }
    close();
}

// Method to format date with AM/PM
const formatDate = (date: Date) => {
    return format(new Date(date), 'yyyy-MM-dd hh:mm:ss a'); // Adjust format to include AM/PM
};
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Driver" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="728">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto" @click="resetEditedItem">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Attendance
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <!-- Attendance Details -->
                                <v-col cols="12" md="12">
                                    <span class="text-h6 color-light col">Information</span>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select
                                        density="compact"
                                        v-model="editedItem.driver_id"
                                        :items="drivers"
                                        label="Driver"
                                        item-title="first_name"
                                        item-value="id"
                                        hide-details
                                        variant="outlined"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        v-model="editedItem.check_in_time"
                                        label="Check In Time"
                                        hide-details
                                        variant="outlined"
                                        type="datetime-local"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        v-model="editedItem.check_out_time"
                                        label="Check Out Time"
                                        hide-details
                                        variant="outlined"
                                        type="datetime-local"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select
                                        density="compact"
                                        v-model="editedItem.status"
                                        :items="['On Going', 'Finished']"
                                        label="Status"
                                        hide-details
                                        variant="outlined"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn
                            color="secondary"
                            :disabled="!editedItem.check_in_time || !editedItem.check_out_time"
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
                <th class="text-subtitle-1 font-weight-semibold">Driver</th>
                <th class="text-subtitle-1 font-weight-semibold">Check In Time</th>
                <th class="text-subtitle-1 font-weight-semibold">Check Out Time</th>
                <th class="text-subtitle-1 font-weight-semibold">Status</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="filteredList.length === 0">
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="d-flex flex-column align-center py-8">
                            <h2 class="text-h4 mb-4">Nothing found 🧐</h2>
                            <p class="text-gray-600">
                                No item match your search criteria, please input different <br />keyword or refresh the page.
                            </p>
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="item in filteredList" :key="item.id">
                    <td class="text-subtitle-1">{{ item.driver.first_name }}</td>
                    <td class="text-subtitle-1">{{ formatDate(item.check_in_time) }}</td>
                    <td class="text-subtitle-1">{{ formatDate(item.check_out_time) }}</td>
                    <td class="text-subtitle-1">
                        <v-chip :color="item.status === 'On Going' ? 'primary' : 'success'" class="text-uppercase font-weight-semibold">
                            {{ item.status }}
                        </v-chip>
                    </td>
                    <!-- <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Edit">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon flat @click="editItem(item)" v-bind="props" disabled>
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Delete">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon flat @click="deleteItem(item)" v-bind="props" disabled>
                                        <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td> -->
                </tr>
            </template>
        </tbody>
    </v-table>
</template>
