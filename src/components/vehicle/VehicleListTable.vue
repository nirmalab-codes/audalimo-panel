<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVehicleStore } from '@/stores/apps/vehicle';
import { type VehicleVo, getDefaultVehicleVo } from '@/contracts/vo/Vehicle.vo';
import { useDriverStore } from '@/stores/driver';

const store = useVehicleStore();
const driverStore = useDriverStore();

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const defaultItem = ref<VehicleVo>(getDefaultVehicleVo());
const editedItem = ref<VehicleVo>(defaultItem.value);

onMounted(() => {
    driverStore.retrieveAllVerifiedDrivers();
    store.fetchVehicles();
});

// Computed
const vehicles = computed(() => store.vehicles);
const drivers = computed(() => driverStore.verifiedDrivers);
const formTitle = computed(() => (editedItem.value.id ? 'Edit Vehicle' : 'New Vehicle'));
const filteredList = computed(() => vehicles.value.filter((vehicle) => vehicle.name.toLowerCase().includes(search.value.toLowerCase())));

//Methods
const resetEditedItem = () => {
    driverStore.retrieveAllVerifiedDrivers();
    editedItem.value = { ...defaultItem.value };
    isEdit.value = false;
};

function editItem(vehicle: VehicleVo) {
    editedItem.value = { ...vehicle };
    editedItem.value.driverIds = vehicle.driverNames.map((item: any) => item.driver.id);
    isEdit.value = true;
    dialog.value = true;
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

async function save() {
    if (isEdit.value) {
        await store.updateVehicle(editedItem.value);
    } else {
        await store.createVehicle(editedItem.value);
    }
    close();
}
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Vehicle" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
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
                                <v-col cols="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.name"
                                        label="Vehicle Name"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.vehicleType"
                                        label="Vehicle Type"
                                        required
                                        :items="['Limousine', 'Bus', 'Van', 'Sport', 'Truck', 'Electric']"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.registrationDate"
                                        label="Registration Date"
                                        type="date"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.licensePlate"
                                        label="License Plate"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.ownership"
                                        label="Ownership"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.rtaOffice"
                                        label="RTA Office"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-autocomplete
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.driverIds"
                                        label="Driver ID"
                                        required
                                        :items="drivers"
                                        item-title="first_name"
                                        item-value="id"
                                        multiple
                                        clearable
                                        chips
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model.number="editedItem.seat"
                                        label="Seat"
                                        required
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
                            :disabled="!editedItem.name || !editedItem.licensePlate || !editedItem.ownership"
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
                <th class="text-subtitle-1 font-weight-semibold">Name</th>
                <th class="text-subtitle-1 font-weight-semibold">License Plate</th>
                <th class="text-subtitle-1 font-weight-semibold">Ownership</th>
                <th class="text-subtitle-1 font-weight-semibold">Vehicle Type</th>
                <th class="text-subtitle-1 font-weight-semibold">RTA Office</th>
                <th class="text-subtitle-1 font-weight-semibold">Driver ID</th>
                <th class="text-subtitle-1 font-weight-semibold">Seat</th>
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
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.licensePlate }}</td>
                    <td class="text-subtitle-1">{{ item.ownership }}</td>
                    <td class="text-subtitle-1">{{ item.vehicleType }}</td>
                    <td class="text-subtitle-1">{{ item.rtaOffice }}</td>
                    <td class="text-subtitle-1">
                        <v-chip size="small" v-for="i in item.driverNames as any" :key="i" class="ma-1" text-color="white">
                            {{ i.driver.first_name }}
                        </v-chip>
                    </td>
                    <td class="text-subtitle-1">{{ item.seat }}</td>
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
