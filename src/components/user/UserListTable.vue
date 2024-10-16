<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { formatDistanceToNow } from 'date-fns';

import VueAvatar from '@webzlodimir/vue-avatar';
import '@webzlodimir/vue-avatar/dist/style.css';

const userStore = useUserStore();

const { userList } = storeToRefs(userStore);

onMounted(() => {
    userStore.retrieveList();
});

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const editedIndex = ref(-1);
const editedItem = ref({
    id: '',
    fullname: '',
    email: '',
    phone: '',
    new_password: '',
    confirm_new_password: '',
    is_active: false,
    address: '',
    role_id: '',
    role: ''
});
const defaultItem = ref({
    id: '',
    fullname: '',
    email: '',
    phone: '',
    is_active: false,
    address: '',
    new_password: '',
    confirm_new_password: '',
    role_id: '',
    role: ''
});
const isEditMode = ref(false); // Menambahkan state untuk mode edit

//Methods
const filteredList = computed(() => {
    return userList.value.filter((user: any) => {
        return (
            user.fullname?.toLowerCase().includes(search.value.toLowerCase()) ||
            user.phone?.toLowerCase().includes(search.value.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.value.toLowerCase())
        );
    });
});

function openDialog(item: any = null) {
    if (item) {
        editedIndex.value = userList.value.indexOf(item);
        editedItem.value = Object.assign({}, item);
        isEditMode.value = true; // Set mode ke edit
    } else {
        editedItem.value = { ...defaultItem.value };
        editedIndex.value = -1;
        isEditMode.value = false; // Set mode ke create
    }
    dialog.value = true; // Buka dialog
}

async function deleteItem(item: any) {
    const result = confirm('Are you sure you want to delete this item?');
    if (result) {
        await userStore.deleteUser(item.id);
        userStore.retrieveList();
    }
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = { ...defaultItem.value };
        editedIndex.value = -1;
    }, 300);
}

async function save() {
    const payload = {
        fullname: editedItem.value.fullname,
        email: editedItem.value.email,
        phone: editedItem.value.phone,
        is_active: editedItem.value.is_active,
        role_id: editedItem.value.role_id,
        address: editedItem.value.address,
        new_password: editedItem.value.new_password,
        confirm_new_password: editedItem.value.confirm_new_password
    };
    if (isEditMode.value) {
        await userStore.updateUser(editedItem.value.id, payload);
    } else {
        await userStore.createUser(payload);
    }
    userStore.retrieveList();
    close();
}

//Computed Property
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'New User' : 'Edit User';
});

// Watch for changes in the dialog state
watch(dialog, (newValue) => {
    if (!newValue) {
        editedItem.value = { ...defaultItem.value }; // Mengosongkan editedItem ketika dialog ditutup
        editedIndex.value = -1; // Reset editedIndex
    }
});
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search User" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto" @click="openDialog()">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add User
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">{{ isEditMode ? 'Edit User' : 'New User' }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.fullname"
                                        label="Fullname"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.email"
                                        autocomplete="off"
                                        label="Email"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.phone"
                                        label="Phone"
                                        type="phone"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        :items="[
                                            { name: 'Superadmin', value: '673c0385-d8d3-4f6f-8c42-f53f5a16c234' },
                                            { name: 'Admin', value: '61b9e035-9289-48e0-9b2f-7ac2f7348266' },
                                            { name: 'SPV', value: '2dff426e-82ae-458c-91fd-0d4123038a07' },
                                            { name: 'Finance', value: '2dff426e-82ae-458c-91fd-0d4123038a08' }
                                        ]"
                                        item-title="name"
                                        item-value="value"
                                        placeholder="Select role"
                                        v-model="editedItem.role_id"
                                        label="Role"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.address"
                                        label="Address"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-select
                                        variant="outlined"
                                        hide-details
                                        item-title="name"
                                        item-value="value"
                                        :items="[
                                            { name: 'Active', value: true },
                                            { name: 'Inactive', value: false }
                                        ]"
                                        placeholder="Select role"
                                        v-model="editedItem.is_active"
                                        label="Status"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        autocomplete="off"
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.new_password"
                                        label="Password"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <!-- Change Password Label -->
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.confirm_new_password"
                                        label="Confirm Password"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn color="secondary" :disabled="editedItem.email == ''" variant="flat" @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-table class="mt-5">
        <thead>
            <tr>
                <!-- <th class="text-subtitle-1 font-weight-semibold">Id</th> -->
                <th class="text-subtitle-1 font-weight-semibold">user</th>
                <th class="text-subtitle-1 font-weight-semibold">Phone</th>
                <th class="text-subtitle-1 font-weight-semibold">Created At</th>
                <th class="text-subtitle-1 font-weight-semibold">Role</th>
                <th class="text-subtitle-1 font-weight-semibold">Status</th>
                <th class="text-subtitle-1 font-weight-semibold">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in filteredList" :key="item.id">
                <!-- <td class="text-subtitle-1">{{ item.id }}</td> -->
                <td>
                    <div class="d-flex align-center py-4">
                        <div>
                            <v-avatar size="80">
                                <vue-avatar :username="item.fullname" />
                            </v-avatar>
                            <!-- <v-img :src="item.upload" width="45px" class="rounded-circle img-fluid"></v-img> -->
                        </div>

                        <div class="ml-5">
                            <h4 class="text-h6 font-weight-semibold">{{ item.fullname || 'N/A' }}</h4>
                            <span class="text-subtitle-1 d-block mt-1 textSecondary">{{ item.email || 'N/A' }}</span>
                        </div>
                    </div>
                </td>
                <td class="text-subtitle-1">{{ item.phone || 'N/A' }}</td>
                <td class="text-subtitle-1">{{ formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) || 'N/A' }}</td>
                <td>
                    <v-chip :color="item.role.name" size="small" label>{{ item.role.name || 'N/A' }}</v-chip>
                </td>
                <td>
                    <v-chip :color="item.is_active ? 'success' : 'error'" size="small" label>{{
                        item.is_active ? 'Active' : 'Inactive'
                    }}</v-chip>
                </td>
                <td>
                    <div class="d-flex align-center">
                        <v-tooltip text="Edit">
                            <template v-slot:activator="{ props }">
                                <v-btn icon flat @click="openDialog(item)" v-bind="props"
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
