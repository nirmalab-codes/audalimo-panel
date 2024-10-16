<script setup lang="ts">
import Logo from '@/layouts/full/logo/Logo.vue';
/* Login form */
import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
    <div class="authentication">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" class="d-flex align-center">
                    <v-card rounded="md" elevation="10" class="px-sm-1 px-0 mx-auto" max-width="450">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4 mb-5"><Logo /></div>
                            <!-- <div class="text-h6 text-medium-emphasis text-center mb-6">Your Social Campaigns</div> -->
                            <div class="d-flex align-center text-center mb-6">
                                <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                                    <span class="bg-surface px-5 py-3 position-relative">welcome to audalimo</span>
                                </div>
                            </div>
                            <LoginForm />
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
