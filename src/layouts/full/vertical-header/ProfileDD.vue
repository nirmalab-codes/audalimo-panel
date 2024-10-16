<script setup lang="ts">
import { MailIcon } from 'vue-tabler-icons';
import { profileDD } from '@/_mockApis/headerData';

import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

import VueAvatar from '@webzlodimir/vue-avatar';
import '@webzlodimir/vue-avatar/dist/style.css';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const role = [
    { name: 'Superadmin', value: '673c0385-d8d3-4f6f-8c42-f53f5a16c234' },
    { name: 'Admin', value: '61b9e035-9289-48e0-9b2f-7ac2f7348266' },
    { name: 'SPV', value: '2dff426e-82ae-458c-91fd-0d4123038a07' },
    { name: 'Finance', value: '2dff426e-82ae-458c-91fd-0d4123038a08' }
]
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <!-- <img src="@/assets/images/profile/user-1.jpg" width="35" alt="Julia" /> -->
                    <vue-avatar :username="user.fullname" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pt-6">
                <h6 class="text-h5 font-weight-medium">User Profile</h6>
                <div class="d-flex align-center mt-4 pb-6">
                    <v-avatar size="80">
                        <!-- <img src="@/assets/images/profile/user-1.jpg" width="80" /> -->
                        <vue-avatar :username="user.fullname" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-h6 mb-n1">{{ user.fullname }}</h6>
                        <span class="text-subtitle-1 font-weight-regular textSecondary">{{ role.find(r => r.value === user.role_id)?.name || 'N/A' }}</span>
                        <div class="d-flex align-center mt-1">
                            <MailIcon size="18" stroke-width="1.5" />
                            <span class="text-subtitle-1 font-weight-regular textSecondary ml-2">{{ user.email }}</span>
                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
            </div>
            <perfect-scrollbar style="height: calc(100vh - 240px); max-height: 240px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in profileDD" :key="item.title" class="py-4 px-8 custom-text-primary" :to="item.href">
                        <template v-slot:prepend>
                            <v-avatar size="48" color="lightprimary" class="mr-3" rounded="md">
                                <v-img :src="item.avatar" width="24" height="24" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
                    </v-list-item>
                </v-list>
            </perfect-scrollbar>
            <!-- <div class="px-8 py-3">
                <div class="bg-lightprimary rounded-md pa-5 overflow-hidden position-relative">
                    <h5 class="text-h6">
                        Unlimited<br />
                        Access
                    </h5>
                    <v-btn variant="flat" color="primary" class="mt-3">Upgrade</v-btn>
                    <img src="@/assets/images/backgrounds/unlimited-bg.png" alt="bg-img" class="right-pos-img" />
                </div>
            </div> -->
            <div class="pt-4 pb-6 px-8 text-center">
                <v-btn color="primary" variant="outlined" block @click="authStore.logout()">Logout</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
