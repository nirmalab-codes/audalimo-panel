<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVehicleStore } from '@/stores/apps/vehicle';
import { type VehicleVo, getDefaultVehicleVo } from '@/contracts/vo/Vehicle.vo';
import { useDriverStore } from '@/stores/driver';
import type { UploadDto } from '@/contracts/response/UploadRelated.response';
import { useUploadStore } from '@/stores/apps/upload';
import { router } from '@/router';
import { UsersIcon } from 'vue-tabler-icons';
import { format } from 'date-fns';

const store = useVehicleStore();
const driverStore = useDriverStore();
const uploadStore = useUploadStore();

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const defaultItem = ref<VehicleVo>(getDefaultVehicleVo());
const editedItem = ref<VehicleVo>(defaultItem.value);
const fileToUploadCar = ref<File | null>(null);
const fileToUploadMulkiya = ref<File | null>(null);

onMounted(() => {
    driverStore.retrieveAllVerifiedDrivers();
    store.fetchVehicles();
});

// Computed
const vehicles = computed(() => store.vehicles);
const drivers = computed(() => driverStore.verifiedDrivers);
const formTitle = computed(() => (editedItem.value.id ? 'Edit Vehicle' : 'New Vehicle'));
const filteredList = computed(() =>
    vehicles.value.filter((vehicle) => vehicle.vehicle_type.toLowerCase().includes(search.value.toLowerCase()))
);

//Methods
const resetEditedItem = () => {
    driverStore.retrieveAllVerifiedDrivers();
    editedItem.value = { ...defaultItem.value, driver_ids: [] };
    isEdit.value = false;
};

function editItem(vehicle: VehicleVo) {
    router.push({ name: 'Vehicle Detail', params: { id: vehicle.id } });
    // editedItem.value = { ...vehicle };
    // editedItem.value.driver_ids = vehicle.driver_ids || [];
    // isEdit.value = true;
    // dialog.value = true;
}

async function deleteItem(vehicle: VehicleVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteVehicle(vehicle.id);
    }
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        resetEditedItem();
    }, 300);
}

function onFileChangeCar(e: any) {
    fileToUploadCar.value = e.target.files[0];
}

function onFileChangeMulkiya(e: any) {
    fileToUploadMulkiya.value = e.target.files[0];
}

async function save() {
    if (fileToUploadCar.value && fileToUploadMulkiya.value) {
        const uploadResponseCar: UploadDto | null = await uploadStore.upload(fileToUploadCar.value);
        const uploadResponseMulkiya: UploadDto | null = await uploadStore.upload(fileToUploadMulkiya.value);

        console.log(uploadResponseCar, uploadResponseMulkiya);

        if (uploadResponseCar && uploadResponseMulkiya) {
            editedItem.value.upload_id = uploadResponseCar.id;
            editedItem.value.mulkiya_upload_id = uploadResponseMulkiya.id;

            if (isEdit.value) {
                console.log('Updated document: ', editedItem.value);
                await store.updateVehicle(editedItem.value);
            } else {
                console.log('Created document: ', editedItem.value);
                await store.createVehicle(editedItem.value);
            }
        }
        return close();
    } else if (isEdit.value) {
        await store.updateVehicle(editedItem.value);
    }
    close();
}

function addDriverShift() {
    if (editedItem.value.driver_ids.length < 2) {
        editedItem.value.driver_ids.push({
            driver_id: '',
            start_date: new Date(),
            end_date: new Date(),
            start_time: '',
            end_time: ''
        });
    }
}

function removeDriverShift(index: number) {
    editedItem.value.driver_ids.splice(index, 1);
}

function getDriverName(driverId: string) {
    const driver = drivers.value.find((d) => d.id === driverId);
    return driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
}
</script>

<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Vehicle" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1024">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto" @click="resetEditedItem">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Vehicle
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12" md="9">
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.vehicle_type"
                                                label="Vehicle Type"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.vehicle_number"
                                                label="Chassis Number"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model.number="editedItem.year_model"
                                                label="Year Model"
                                                type="number"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.registration_date"
                                                label="Registration Date"
                                                type="date"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.expiration_date"
                                                label="Expiration Date"
                                                type="date"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.insurance_date"
                                                label="Insurance Expiry Date"
                                                type="date"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.insurance_number"
                                                label="Insurance Policy Number"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model="editedItem.traffic_plate"
                                                label="Traffic Plate"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                variant="outlined"
                                                hide-details
                                                v-model.number="editedItem.seat"
                                                label="Seat"
                                                type="number"
                                                required
                                            ></v-text-field>
                                        </v-col>


                                        <v-col cols="12" md="4">
                                            <v-select
                                                v-model="editedItem.maintenance_km"
                                                :items="[10000, 20000, 30000, 40000]"
                                                label="Interval Maintenance Km"
                                                type="number"
                                                required
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-switch class="p-0" v-model="editedItem.status" label="Status" color="success"></v-switch>
                                        </v-col>

                                        <!-- Driver Shifts -->
                                        <v-col cols="12">
                                            <v-row>
                                                <v-card-title class="flex-grow-1 text-h6 mb-4">
                                                    <!-- <h3>Driver Shifts</h3> -->
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                        color="primary"
                                                        @click="addDriverShift"
                                                        :disabled="editedItem.driver_ids.length >= 2"
                                                    >
                                                        Add Driver Shift
                                                    </v-btn>
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-row v-for="(shift, index) in editedItem.driver_ids" :key="index">
                                                        <v-col cols="12" md="2">
                                                            <v-select
                                                                v-model="shift.driver_id"
                                                                :items="drivers"
                                                                item-title="first_name"
                                                                item-value="id"
                                                                label="Select Driver"
                                                                required
                                                            ></v-select>
                                                        </v-col>
                                                        <v-col cols="12" md="3">
                                                            <v-text-field
                                                                v-model="shift.start_date"
                                                                label="Start Date"
                                                                type="date"
                                                                required
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="3">
                                                            <v-text-field
                                                                v-model="shift.end_date"
                                                                label="End Date"
                                                                type="date"
                                                                required
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="2">
                                                            <v-text-field
                                                                v-model="shift.start_time"
                                                                label="Start Time"
                                                                type="time"
                                                                required
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="2">
                                                            <v-text-field
                                                                v-model="shift.end_time"
                                                                label="End Time"
                                                                type="time"
                                                                required
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" class="text-right py-0">
                                                            <v-btn color="error" @click="removeDriverShift(index)">Remove</v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-file-input
                                                class="text-truncate"
                                                label="Upload image of car"
                                                density="compact"
                                                variant="outlined"
                                                @change="onFileChangeCar"
                                            ></v-file-input>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-file-input
                                                class="text-truncate"
                                                label="Upload image of mulkiya"
                                                density="compact"
                                                variant="outlined"
                                                @change="onFileChangeMulkiya"
                                            ></v-file-input>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn color="secondary" :disabled="!editedItem.vehicle_type" variant="flat" @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">Vehicle Type</th>
                <th class="text-subtitle-1 font-weight-semibold">Chassis Number</th>
                <th class="text-subtitle-1 font-weight-semibold">Year Model</th>
                <th class="text-subtitle-1 font-weight-semibold">Registration Date</th>
                <th class="text-subtitle-1 font-weight-semibold">Traffic Plate</th>
                <th class="text-subtitle-1 font-weight-semibold">Seat <UsersIcon size="16" /></th>
                <th class="text-subtitle-1 font-weight-semibold">Status</th>
                <th class="text-subtitle-1 font-weight-semibold">Drivers</th>
                <th class="text-subtitle-1 font-weight-semibold">Actions</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="filteredList.length === 0">
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="d-flex flex-column align-center py-8">
                            <h2 class="text-h4 mb-4">Nothing found</h2>
                            <p class="text-gray-600">
                                No item match your search criteria, please input different <br />keyword or refresh the page.
                            </p>
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="item in filteredList" :key="item.id">
                    <td class="text-subtitle-1 cursor-pointer" @click="editItem(item)">
                        <div class="d-flex align-center py-4">
                            <div>
                                <v-img :src="item.upload?.signed_url" width="45px" class="rounded img-fluid"></v-img>
                            </div>

                            <div class="ml-5">
                                <h4 class="text-h6 font-weight-semibold">{{ item.traffic_plate }}</h4>
                                <span class="text-subtitle-1 d-block mt-1 textSecondary">{{ item.vehicle_type }}</span>
                            </div>
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.vehicle_number }}</td>
                    <td class="text-subtitle-1">{{ item.year_model }}</td>
                    <td class="text-subtitle-1">{{ format(new Date(item.registration_date), 'dd MMM yyyy') }}</td>
                    <td class="text-subtitle-1">{{ item.traffic_plate }}</td>
                    <td class="text-subtitle-1">{{ item.seat }} seats</td>
                    <td class="text-subtitle-1">
                        <v-chip :color="item.status ? 'success' : 'error'" small>
                            {{ item.status ? 'Active' : 'Inactive' }}
                        </v-chip>
                    </td>
                    <td class="text-subtitle-1">
                        <v-chip v-for="(shift, index) in item.driver_ids" :key="index" class="ma-1" small>
                            {{ getDriverName(shift.driver_id) }}
                        </v-chip>
                    </td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Edit">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon flat @click="editItem(item)" v-bind="props">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Delete">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon flat @click="deleteItem(item)" v-bind="props">
                                        <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </v-table>
</template>
