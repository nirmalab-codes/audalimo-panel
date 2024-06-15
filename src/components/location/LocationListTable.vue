<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLocationStore } from '@/stores/apps/location';
import { getDefaultLocationVo, type LocationVo } from '@/contracts/vo/Location.vo';
import { FormAttr } from '@/enums/LocationRelated.enum';

const store = useLocationStore();
const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const defaultItem = ref<LocationVo>(getDefaultLocationVo());
const editedItem = ref<LocationVo>(defaultItem.value);

onMounted(() => {
    store.fetchLocations()
});

// Computed
const locations = computed(() => store.locations);
const formTitle = computed(() => editedItem.value ? 'Edit Location' : 'New Location');
const filteredList = computed(() => locations.value.filter(location => location.title.toLowerCase().includes(search.value.toLowerCase())));
const formAttrItems = computed(() => Object.values(FormAttr));

//Methods
const resetEditedItem = () => {
  editedItem.value = {...defaultItem.value};
  isEdit.value = false;
};

function editItem(location: LocationVo) {
    editedItem.value = { ...location };
    isEdit.value = true;
    dialog.value = true;
}

async function deleteItem(location: LocationVo) {
    if (confirm('Are you sure you want to delete this item?')) {
        await store.deleteLocation(location.id);
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
        await store.updateLocation(editedItem.value);
    } else {
        await store.createLocation(editedItem.value);
    }
    close();
}
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Location" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto" @click="resetEditedItem">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Location
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
                                        v-model="editedItem.title"
                                        label="Title"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.urlLink"
                                        label="URL Google Maps"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        :items="formAttrItems"
                                        v-model="editedItem.formAttr"
                                        label="Form Attribute"
                                        required
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" v-if="!isEdit">
                                    <v-checkbox
                                        v-model="editedItem.locationStatus"
                                        label="Location Status"
                                        hide-details
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn
                            color="secondary"
                            :disabled="!editedItem.title || !editedItem.urlLink || !editedItem.formAttr"
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
                <th class="text-subtitle-1 font-weight-semibold">Title</th>
                <th class="text-subtitle-1 font-weight-semibold">Url Link</th>
                <th class="text-subtitle-1 font-weight-semibold">Form Attr</th>
                <th class="text-subtitle-1 font-weight-semibold">Location Status</th>
                <th class="text-subtitle-1 font-weight-semibold">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in filteredList" :key="item.id">
                <td class="text-subtitle-1">{{ item.title }}</td>
                <td class="text-subtitle-1">{{ item.urlLink }}</td>
                <td class="text-subtitle-1">{{ item.formAttr }}</td>
                <td>
                    <v-chip :color="item.locationStatus ? 'success' : 'warning'" size="small" label>{{ item.locationStatus }}</v-chip>
                </td>
                <td>
                    <div class="d-flex align-center">
                        <v-tooltip text="Edit">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="editItem(item)" v-bind="props"
                                    ><PencilIcon stroke-width="1.5" size="20" class="text-primary"
                                /></v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Delete">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="deleteItem(item)" v-bind="props"
                                    ><TrashIcon stroke-width="1.5" size="20" class="text-error"
                                /></v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
