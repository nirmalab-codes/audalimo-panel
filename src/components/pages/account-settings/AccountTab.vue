<script setup lang="ts">
import { router } from '@/router';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

const password = ref({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
});

const user = ref({
    id: '',
    fullname: '',
    email: '',
    phone: '',
    address: '',
    role_id: '',
    is_active: false,
    new_password: '',
    confirm_new_password: ''
});
const userStore = useUserStore();

onMounted(async () => {
    retrieveMe();
});

async function retrieveMe() {
    const retrievedUser = await userStore.retrieveMe();
    user.value = { ...retrievedUser } as any;
}

async function changePassword() {
    await userStore.changePassword({
        current_password: password.value.current_password,
        new_password: password.value.new_password,
        confirm_new_password: password.value.confirm_new_password
    });
}

async function save() {
    await userStore.updateUser(user.value.id, {
        fullname: user.value.fullname,
        email: user.value.email,
        phone: user.value.phone,
        address: user.value.address,
        role_id: user.value.role_id,
        is_active: user.value.is_active,
        new_password: user.value.new_password,
        confirm_new_password: user.value.confirm_new_password
    });
    await retrieveMe();
}
</script>

<template>
    <v-card elevation="10">
        <v-row class="ma-sm-n2 ma-n1">
            <!-- <v-col cols="12" sm="6">
                <v-card elevation="10">
                    <v-card-item>
                        <h5 class="text-h5">Change Profile</h5>
                        <div class="text-subtitle-1 text-medium-emphasis mt-2 mb-12">Change your profile picture from here</div>
                        <div class="text-center mt-6 mb-6">
                            <v-avatar size="120">
                                <img src="@/assets/images/profile/user-1.jpg" height="120" alt="image" />
                            </v-avatar>
                        </div>
                        <div class="d-flex justify-center">
                            <v-btn color="primary" class="mx-2" flat> Upload</v-btn>
                            <v-btn color="error" class="mx-2" variant="outlined" flat>Reset</v-btn>
                        </div>
                        <div class="text-subtitle-1 text-medium-emphasis text-center my-sm-8 my-6">
                            Allowed JPG, GIF or PNG. Max size of 800K
                        </div>
                    </v-card-item>
                </v-card>
            </v-col> -->
            <v-col cols="12" sm="6">
                <v-card-item class="px-0 pt-0">
                    <h5 class="text-h5">Change Password</h5>
                    <div class="text-subtitle-1 text-medium-emphasis mt-2">To change your password please confirm here</div>
                    <div class="mt-5">
                        <v-label class="mb-2 font-weight-medium">Current Password</v-label>
                        <v-text-field
                            color="primary"
                            variant="outlined"
                            type="password"
                            v-model="password.current_password"
                            placeholder="Enter your current password"
                        />
                        <v-label class="mb-2 font-weight-medium">New Password</v-label>
                        <v-text-field
                            color="primary"
                            variant="outlined"
                            type="password"
                            v-model="password.new_password"
                            placeholder="Enter your new password"
                        />
                        <v-label class="mb-2 font-weight-medium">Confirm Password</v-label>
                        <v-text-field
                            color="primary"
                            variant="outlined"
                            type="password"
                            v-model="password.confirm_new_password"
                            placeholder="Enter your confirm password"
                        />
                    </div>
                    <v-col cols="12">
                        <v-btn color="primary" class="mr-4" flat @click="changePassword">Change Password</v-btn>
                    </v-col>
                </v-card-item>
            </v-col>
            <v-col cols="12" sm="6">
                <v-card-item class="px-0 py-0">
                    <h5 class="text-h5">Personal Details</h5>
                    <div class="text-subtitle-1 text-medium-emphasis mt-2">To change your personal detail , edit and save from here</div>
                    <div class="mt-5">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Your Name</v-label>
                                <v-text-field
                                    color="primary"
                                    variant="outlined"
                                    type="text"
                                    v-model="user.fullname"
                                    hide-details
                                    placeholder="Enter your name"
                                />
                            </v-col>
                            <!-- <v-col cols="12" md="6">
                                    <v-label class="mb-2 font-weight-medium">Store Name</v-label>
                                    <v-text-field color="primary" variant="outlined" type="text" v-model="storemodel" hide-details />
                                </v-col> -->
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Role</v-label>
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
                                    v-model="user.role_id"
                                    label="Role"
                                ></v-select>
                            </v-col>
                            <!-- <v-col cols="12" md="6">
                                    <v-label class="mb-2 font-weight-medium">Currency</v-label>
                                    <v-select
                                        v-model="Currencyselect"
                                        :items="Currency"
                                        item-title="state"
                                        item-value="abbr"
                                        label="Select"
                                        return-object
                                        single-line
                                        variant="outlined"
                                        hide-details
                                    ></v-select>
                                </v-col> -->
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Email</v-label>
                                <v-text-field
                                    color="primary"
                                    variant="outlined"
                                    type="email"
                                    v-model="user.email"
                                    hide-details
                                    placeholder="Enter your email"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Phone</v-label>
                                <v-text-field
                                    color="primary"
                                    variant="outlined"
                                    type="text"
                                    v-model="user.phone"
                                    hide-details
                                    placeholder="Enter your phone number"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="mb-2 font-weight-medium">Address</v-label>
                                <v-text-field
                                    color="primary"
                                    variant="outlined"
                                    type="text"
                                    v-model="user.address"
                                    hide-details
                                    placeholder="Enter your address"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="primary" flat @click="save">Save</v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-item>
            </v-col>
        </v-row>
        <!-- <div class="d-flex justify-end">
            <v-btn color="primary" class="mr-4" flat @click="save">Save</v-btn>
            <v-btn size="large" class="bg-lighterror text-error" flat @click="router.back()">Cancel</v-btn>
        </div> -->
    </v-card>
</template>
