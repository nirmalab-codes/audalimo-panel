<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
</script>

<template>
    <v-sheet rounded="md" color="lightsecondary" class="px-4 py-3 ExtraBox">
        <div class="d-flex align-center hide-menu">
            <v-avatar size="40">
                <!-- <img src="@/assets/images/profile/user-1.jpg" alt="user" height="40" /> -->
                <vue-avatar :username="user.fullname" />
            </v-avatar>
            <div class="ml-4">
                <h4 class="mb-n1 text-h6 textPrimary">{{ user.fullname }}</h4>
                <small class="text-subtitle-1 d-block mt-1 textSecondary"
                    style="width: 100px;overflow: hidden;text-overflow: ellipsis;">{{ user.email }}</small>
            </div>
            <div class="ml-auto">
                <v-btn variant="text" icon rounded="md" color="primary" @click="authStore.logout()">
                    <PowerIcon />
                    <v-tooltip activator="parent" location="top">Logout</v-tooltip>
                </v-btn>
            </div>
        </div>
    </v-sheet>
</template>
<style lang="scss">
.ExtraBox {
    position: relative;
    overflow: hidden;
}

.line-height-none {
    line-height: normal;
}
</style>
