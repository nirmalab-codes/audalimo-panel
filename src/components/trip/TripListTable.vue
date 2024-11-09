<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTripStore } from '@/stores/apps/trip';
import { type TripVo, getDefaultTripVo } from '@/contracts/vo/Trip.vo';
import { useDriverStore } from '@/stores/driver';
import type { UploadDto } from '@/contracts/response/UploadRelated.response';
import { useUploadStore } from '@/stores/apps/upload';
import { format, parseISO } from 'date-fns'; // Import date-fns or any date formatting library
import { useAuthStore } from '@/stores/auth';
import { api as viewerApi } from 'v-viewer';

const store = useTripStore();
const driverStore = useDriverStore();
const authStore = useAuthStore();

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const defaultItem = ref<TripVo>(getDefaultTripVo());
const editedItem = ref<TripVo>(defaultItem.value);

onMounted(() => {
    driverStore.retrieveAllVerifiedDrivers();
    store.fetchTrips();
});

// Computed
const trips = computed(() => store.trips);
const drivers = computed(() => driverStore.verifiedDrivers);
const formTitle = computed(() => (editedItem.value.id ? 'Edit Trip' : 'New Trip'));
const filteredList = computed(() =>
    trips.value.filter((trip: TripVo) => trip.driver.first_name.toLowerCase().includes(search.value.toLowerCase()))
);
const fileToUpload = ref<File | null>(null);
const uploadStore = useUploadStore();

//Methods
const resetEditedItem = () => {
    driverStore.retrieveAllVerifiedDrivers();
    editedItem.value = { ...defaultItem.value };
    isEdit.value = false;
};

function editItem(trip: TripVo) {
    editedItem.value = { ...trip };

    // Parse the original date and format it
    const parsedDate = parseISO(trip.trip_date.toString());
    editedItem.value.trip_date = format(parsedDate, "yyyy-MM-dd'T'HH:mm");
    editedItem.value.verified_by = authStore.user.uid;
    isEdit.value = true;
    dialog.value = true;
}

function onFileChange(e: any) {
    fileToUpload.value = e.target.files[0];
}

async function deleteItem(trip: TripVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteTrip(trip.id);
    }
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        resetEditedItem();
    }, 300);
}

function seeDocument(trip: TripVo) {
    viewerApi({ images: [trip.upload.signed_url] });
}

function downloadDocument(trip: TripVo) {
    if (trip.upload.signed_url) {
        fetch(trip.upload.signed_url)
            // check to make sure you didn't have an unexpected failure (may need to check other things here depending on use case / backend)
            .then((resp) => (resp.status === 200 ? resp.blob() : Promise.reject('something went wrong')))
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = trip.upload.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert('oh no!'));
    } else {
        console.error('No signed URL available for this document.');
    }
}

async function save() {
    if (fileToUpload.value) {
        const uploadResponse: UploadDto | null = await uploadStore.upload(fileToUpload.value);

        console.log(uploadResponse);

        if (uploadResponse) {
            editedItem.value.upload_id = uploadResponse.id;

            if (isEdit.value) {
                console.log('Updated document: ', editedItem.value);
                await store.updateTrip(editedItem.value);
            } else {
                console.log('Created document: ', editedItem.value);
                await store.createTrip(editedItem.value);
            }
        }
        return close();
    } else if (isEdit.value) {
        await store.updateTrip(editedItem.value);
    }
    close();
}

// Method to format date with AM/PM
const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yy, HH:mm a'); // Adjust format to include AM/PM
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
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Trip
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <!-- Trip Details -->
                                <v-col cols="12" md="12">
                                    <span class="text-h6 color-light col">Information</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.trip_date"
                                        label="Trip Date"
                                        type="datetime-local"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-autocomplete
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.driver_id"
                                        label="Driver"
                                        :items="drivers"
                                        item-title="first_name"
                                        item-value="id"
                                        required
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.start_location_name"
                                        label="Start Location Name"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.end_location_name"
                                        label="End Location Name"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.payment_type"
                                        :items="['CASH', 'CARD']"
                                        label="Payment Type"
                                        required
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.app_used"
                                        label="App Used"
                                        :items="['Uber', 'Careem']"
                                        required
                                    ></v-select>
                                </v-col>
                                <!-- Trip Details -->
                                <v-col cols="12" md="12">
                                    <span class="text-h6 color-light col">Trip Details</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.distance_km"
                                        label="Distance"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.duration_minutes"
                                        label="Duration"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.total_fare"
                                        label="Total Fare"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.tips"
                                        label="Tips"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.toll"
                                        label="Toll fee"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.taxes"
                                        label="Taxes"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.service_fee"
                                        label="Service Fee"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.rta_fee"
                                        label="RTA Fee"
                                        type="number"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <!-- Trip Details -->
                                <v-col cols="12" md="6">
                                    <span class="text-h6 color-light col">Attachments Trip</span>
                                </v-col>
                                <v-col cols="12" md="6" v-if="editedItem.upload" class="d-flex justify-end">
                                    <v-chip @click="seeDocument(editedItem)" class="mr-2">
                                        <v-icon left>mdi-file-eye</v-icon>
                                        View
                                    </v-chip>
                                    <v-chip @click="downloadDocument(editedItem)">
                                        <v-icon left>mdi-file-document-outline</v-icon>
                                        Download
                                    </v-chip>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-file-input
                                        label="Drop files here or click to upload"
                                        density="compact"
                                        variant="outlined"
                                        @change="onFileChange"
                                    ></v-file-input>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <p class="text-sm">
                                        Please verify the trip if it is correct, make sure the trip is verified and the fare is correct
                                        before saving.
                                    </p>
                                    <v-checkbox v-model="editedItem.verified" label="I Agree if the trip is correct"></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn
                            color="secondary"
                            :disabled="!editedItem.trip_date || !editedItem.start_location_name || !editedItem.end_location_name"
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
                <th class="text-subtitle-1 font-weight-semibold">Trip Date</th>
                <th class="text-subtitle-1 font-weight-semibold">Driver</th>
                <th class="text-subtitle-1 font-weight-semibold">Pickup</th>
                <th class="text-subtitle-1 font-weight-semibold">Distance</th>
                <th class="text-subtitle-1 font-weight-semibold">Duration</th>
                <th class="text-subtitle-1 font-weight-semibold">Fare</th>
                <th class="text-subtitle-1 font-weight-semibold">App</th>
                <th class="text-subtitle-1 font-weight-semibold">OCR Status</th>
                <th class="text-subtitle-1 font-weight-semibold">Verified</th>
                <th class="text-subtitle-1 font-weight-semibold">Actions</th>
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
                    <td class="text-truncate">{{ formatDate(item.trip_date) }}</td>
                    <!-- Updated to format date -->
                    <td class="text-truncate">{{ item.driver.first_name }}</td>
                    <td class="text-truncate">
                        <div class="d-flex align-center">
                            <v-icon size="16" class="mr-1 text-warning">mdi-flag-variant</v-icon>
                            {{ item.start_location_name }}
                        </div>
                        <div class="d-flex align-center">
                            <v-icon size="16" class="mr-1 text-success">mdi-map-marker</v-icon>
                            {{ item.end_location_name }}
                        </div>
                    </td>
                    <td class="text-truncate">{{ item.distance_km }} km</td>
                    <td class="text-truncate">{{ item.duration_minutes }} min</td>
                    <td class="text-truncate">{{ item.total_fare }} <sub>AED</sub></td>
                    <td class="text-truncate">{{ item.app_used }}</td>
                    <!-- <td class="text-truncate">{{ item.status_ocr }}</td> -->
                    <td class="text-truncate">
                        <v-chip
                            size="small"
                            class="text-small text-capitalize"
                            :color="item.ocr_status === 'success' ? 'success' : item.ocr_status === 'pending' ? 'warning' : 'error'"
                        >
                            {{ item.ocr_status }}
                        </v-chip>
                    </td>
                    <td class="text-truncate">
                        <v-chip size="small" class="text-sm" :color="item.verified ? 'success' : 'error'">
                            {{ item.verified ? 'Verified' : 'Not Verified' }}
                        </v-chip>
                    </td>
                    <td>
                        <div class="d-flex align-center">
                            <!-- <v-btn icon flat @click="downloadDocument(item)">
                                <DownloadIcon stroke-width="1.5" size="20" class="text-secondary" />
                            </v-btn> -->
                            <v-tooltip text="Edit">
                                <template v-slot:activator="{ props }">
                                    <!-- <v-btn icon flat @click="editItem(item)" v-bind="props"> -->
                                    <v-btn icon flat @click="$router.push(`/apps/trip/${item.id}`)" v-bind="props">
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
