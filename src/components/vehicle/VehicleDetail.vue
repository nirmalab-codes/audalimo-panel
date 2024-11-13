<template>
    <v-card elevation="10">
        <v-card-text>
            <VehicleQAT :vehicle="vehicle" />
        </v-card-text>
    </v-card>
    <v-card class="mt-4" elevation="10">
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="8">
                        <v-col cols="12" md="12" class="px-0">
                            <span class="text-h6 color-light col">Vehicle Information</span>
                        </v-col>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.vehicle_type"
                                    label="Vehicle Type"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.vehicle_number"
                                    label="Chassis Number"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model.number="vehicle.year_model"
                                    label="Year Model"
                                    type="number"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.registration_date"
                                    label="Registration Date"
                                    type="date"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.expiration_date"
                                    label="Expiration Date"
                                    type="date"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.insurance_date"
                                    label="Insurance Expiry Date"
                                    type="date"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.insurance_number"
                                    label="Insurance Policy Number"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model="vehicle.traffic_plate"
                                    label="Traffic Plate"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    variant="outlined"
                                    hide-details
                                    v-model.number="vehicle.seat"
                                    label="Seat"
                                    type="number"
                                    required
                                ></v-text-field>
                            </v-col>

                            <!-- Driver Shifts -->
                            <v-col cols="12" md="12">
                                <div class="d-flex align-center justify-space-between w-100">
                                    <div class="text-h6 color-light col">Driver Shifts</div>
                                    <div class="text-h6">
                                        <v-btn color="primary" @click="addDriverShift" :disabled="vehicle.driver_ids.length >= 2">
                                            Add Driver Shift
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <v-row>
                                    <v-card-text>
                                        <v-row v-for="(shift, index) in vehicle.driver_ids" :key="index">
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
                                                <v-text-field v-model="shift.end_date" label="End Date" type="date" required></v-text-field>
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
                                                <v-text-field v-model="shift.end_time" label="End Time" type="time" required></v-text-field>
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
                    <v-col cols="4">
                        <v-col cols="12" md="12">
                            <span class="text-h6 color-light col">Vehicle Status</span>
                        </v-col>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-img
                                    v-if="vehicle.upload && vehicle.upload.signed_url"
                                    :src="vehicle.upload.signed_url"
                                    height="150"
                                    cover
                                    class="rounded mb-2"
                                    @click="seeDocument(vehicle.upload.signed_url)"
                                ></v-img>
                                <v-file-input
                                    class="text-truncate"
                                    label="Upload car img"
                                    density="compact"
                                    variant="outlined"
                                    @change="onFileChangeCar"
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-img
                                    v-if="vehicle.mulkiya_upload && vehicle.mulkiya_upload.signed_url"
                                    :src="vehicle.mulkiya_upload.signed_url"
                                    height="150"
                                    cover
                                    class="rounded mb-2"
                                    @click="seeDocument(vehicle.mulkiya_upload.signed_url)"
                                ></v-img>
                                <v-file-input
                                    class="text-truncate"
                                    label="Upload mulkiya"
                                    density="compact"
                                    variant="outlined"
                                    @change="onFileChangeMulkiya"
                                ></v-file-input>
                            </v-col>
                        </v-row>
                        <v-col cols="12">
                            <v-switch v-model="vehicle.status" label="Status" color="success"></v-switch>
                        </v-col>
                        <v-col cols="12" md="12">
                            <span class="text-h6 color-light col">Maintenance Km</span>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-select
                                v-model="vehicle.maintenance_km"
                                :items="[10000, 20000, 30000, 40000]"
                                label="Interval Maintenance Km"
                                type="number"
                                required
                            ></v-select>
                        </v-col>
                    </v-col>
                </v-row>
            </v-form>
            <v-card-actions class="px-0 flex justify-end">
                <v-btn color="error" @click="$router.back()">Cancel</v-btn>
                <v-btn color="secondary" :disabled="!vehicle.vehicle_type" variant="flat" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVehicleStore } from '@/stores/apps/vehicle';
import { type VehicleVo, getDefaultVehicleVo } from '@/contracts/vo/Vehicle.vo';
import { useDriverStore } from '@/stores/driver';
import type { UploadDto } from '@/contracts/response/UploadRelated.response';
import { useUploadStore } from '@/stores/apps/upload';
import { useRoute } from 'vue-router';
import VehicleQAT from './VehicleQAT.vue';
import { api as viewerApi } from 'v-viewer';
import { format } from 'date-fns';

const store = useVehicleStore();
const driverStore = useDriverStore();
const uploadStore = useUploadStore();

const valid = ref(true);
const fileToUploadCar = ref<File | null>(null);
const fileToUploadMulkiya = ref<File | null>(null);

const route = useRoute();

onMounted(() => {
    driverStore.retrieveAllVerifiedDrivers();
    store.fetchVehicle(route.params.id as string);
});

// Computed
const vehicle = computed(() => store.vehicle);
const drivers = computed(() => driverStore.verifiedDrivers);

async function deleteItem(vehicle: VehicleVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteVehicle(vehicle.id);
    }
}

function onFileChangeCar(e: any) {
    fileToUploadCar.value = e.target.files[0];
}

function onFileChangeMulkiya(e: any) {
    fileToUploadMulkiya.value = e.target.files[0];
}

function seeDocument(url: string) {
    viewerApi({ images: [url] });
}

async function save() {
    if (fileToUploadCar.value) {
        const uploadResponseCar: UploadDto | null = await uploadStore.upload(fileToUploadCar.value);
        if (uploadResponseCar) {
            vehicle.value.upload_id = uploadResponseCar.id;
        }
    }
    if (fileToUploadMulkiya.value) {
        const uploadResponseMulkiya: UploadDto | null = await uploadStore.upload(fileToUploadMulkiya.value);
        if (uploadResponseMulkiya) {
            vehicle.value.mulkiya_upload_id = uploadResponseMulkiya.id;
        }
    }
    await store.updateVehicle(vehicle.value);
}

function addDriverShift() {
    if (vehicle.value.driver_ids.length < 2) {
        vehicle.value.driver_ids.push({
            driver_id: '',
            start_date: new Date(),
            end_date: new Date(),
            start_time: '',
            end_time: ''
        });
    }
}

function removeDriverShift(index: number) {
    vehicle.value.driver_ids.splice(index, 1);
}

function getDriverName(driverId: string) {
    const driver = drivers.value.find((d) => d.id === driverId);
    return driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
}

function downloadImage(imageUrl: string, type: string) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${type}-image.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatDate(dateString: any) {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd'); // Mengembalikan string kosong jika tidak valid
}
</script>
