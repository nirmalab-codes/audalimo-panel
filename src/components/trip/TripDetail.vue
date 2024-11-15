<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTripStore } from '@/stores/apps/trip';
import { type TripVo, getDefaultTripVo } from '@/contracts/vo/Trip.vo';
import { useDriverStore } from '@/stores/driver';
import { api as viewerApi } from 'v-viewer';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

const store = useTripStore();
const driverStore = useDriverStore();
const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
    store.fetchTrip(route.params.id as string);
    driverStore.retrieveAllVerifiedDrivers();
});

// Computed
const drivers = computed(() => driverStore.verifiedDrivers);
const fileToUpload = ref<File | null>(null);
const trip = computed(() => store.trip);

function onFileChange(e: any) {
    fileToUpload.value = e.target.files[0];
}

async function deleteItem(trip: TripVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteTrip(trip.id);
    }
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
    trip.value.verified_by = authStore.user.uid;
    console.log(trip.value);
    await store.updateTrip(trip.value);
}
</script>
<template>
    <v-form ref="form" lazy-validation>
        <v-row>
            <v-col cols="12" md="9">
                <v-row class="sticky-top" style="position: sticky; top: 6rem; z-index: 10;">
                    <!-- Trip Details -->
                    <v-col cols="12" md="12">
                        <span class="text-h6 color-light col">Information</span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="trip.trip_date"
                            label="Trip Date"
                            type="datetime-local"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-autocomplete
                            variant="outlined"
                            hide-details
                            v-model="trip.driver_id"
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
                            v-model="trip.start_location_name"
                            label="Start Location Name"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="trip.end_location_name"
                            label="End Location Name"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select
                            variant="outlined"
                            hide-details
                            v-model="trip.payment_type"
                            item-title="text"
                            item-value="value"
                            :items="[
                                { text: 'CASH', value: 'cash' },
                                { text: 'CARD', value: 'card' }
                            ]"
                            label="Payment Type"
                            required
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select
                            variant="outlined"
                            hide-details
                            v-model="trip.app_used"
                            label="App Used"
                            item-title="text"
                            item-value="value"
                            :items="[
                                { text: 'UBER', value: 'uber' },
                                { text: 'CAREEM', value: 'careem' },
                                { text: 'YANGO', value: 'yango' },
                                { text: 'OTHER', value: 'other' }
                            ]"
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
                            suffix="km"
                            v-model.number="trip.distance_km"
                            label="Distance"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="minutes"
                            v-model.number="trip.duration_minutes"
                            label="Duration"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.total_fare"
                            label="Total Fare"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.tips"
                            label="Tips"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.toll"
                            label="Toll fee"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.taxes"
                            label="Taxes"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.service_fee"
                            label="Service Fee"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.rta_fee"
                            label="RTA Fee"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            suffix="AED"
                            v-model.number="trip.net_fare"
                            label="Net Fare"
                            type="number"
                            required
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="12">
                        <span class="text-h6 color-light col">
                            Verification <v-icon v-if="trip.verified" color="success">mdi-check-circle</v-icon></span
                        >
                    </v-col>
                    <v-col cols="12" md="12">
                        <p class="text-sm">
                            {{
                                trip.verified
                                    ? `The trip is already verified by ${trip.user?.fullname} at ${format(
                                          new Date(trip.updated_at),
                                          'MM/dd/yyyy HH:mm aa'
                                      )}`
                                    : 'Please verify the trip if it is correct, make sure the trip is verified and the fare is correct before saving.'
                            }}
                        </p>
                        <v-checkbox v-if="!trip.verified" v-model="trip.verified" label="I Agree if the trip is correct"></v-checkbox>
                    </v-col>
                    <v-col cols="12" md="12" class="d-flex justify-end w-full">
                    <v-card-actions class="pa-4 d-flex justify-end w-full">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="$router.back()">Cancel</v-btn>
                        <v-btn
                            color="secondary"
                            :disabled="!trip.trip_date || !trip.start_location_name || !trip.end_location_name"
                            variant="flat"
                            @click="save"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="3">
                <v-col cols="12" md="12">
                    <span class="text-h6 color-light col">Attachments Trip</span>
                </v-col>
                <v-col cols="12">
                    <v-img
                        v-if="trip.upload && trip.upload.signed_url"
                        :src="trip.upload.signed_url"
                        cover
                        class="rounded mb-2 cursor-pointer"
                        @click="seeDocument(trip)"
                    ></v-img>
                </v-col>
                <v-col cols="12" md="12" v-if="trip.upload" class="d-flex justify-start">
                    <v-chip @click="downloadDocument(trip)">
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
            </v-col>
        </v-row>
    </v-form>
</template>
