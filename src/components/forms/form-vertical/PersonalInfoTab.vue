<script setup lang="ts">
import { ref } from 'vue';
import user1 from '@/assets/images/profile/user-1.jpg';
</script>
<template>
    <div class="ma-4">
        <v-row>
            <v-col cols="12">
                <div class="d-flex justify-space-between">
                    <div class="details">
                        <h2>Uploaded Documents</h2>
                        <h3>Education</h3>
                        <p>High School: SMA Surabaya</p>
                        <p>University: ISTTS</p>
                    </div>
                    <div class="actions d-flex gap-2">
                        <v-btn color="primary" flat class="ml-auto"> <v-icon class="mr-2">mdi-note</v-icon>Add Note </v-btn>
                        <v-btn color="primary" flat class="ml-auto">
                            <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Change Status
                        </v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <!-- Camera Upload -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5">Camera</v-card-title>
                        <h6 class="text-subtitle-1 textSecondary">
                            Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.
                        </h6>
                        <v-card-text>
                            <v-img :src="user1" aspect-ratio="1"></v-img>
                        </v-card-text>
                        <div class="mt-sm-10 mt-5">
                            <v-btn class="mt-sm-15 mt-10" block variant="outlined" color="primary">View all transactions</v-btn>
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>

            <!-- CV Upload -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5">CV Upload</v-card-title>
                        <h6 class="text-subtitle-1 textSecondary">
                            Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.
                        </h6>
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1"></v-img>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>

            <!-- Passport -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5">Passport</v-card-title>
                        <h6 class="text-subtitle-1 textSecondary">
                            Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.
                        </h6>
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1"></v-img>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>

            <!-- Emirates ID -->
            <v-col cols="12" md="4">
                <v-card-item>
                    <v-card elevation="10">
                        <v-card-title class="text-h5">Emirates ID</v-card-title>
                        <h6 class="text-subtitle-1 textSecondary">
                            Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.
                        </h6>
                        <v-card-text>
                            <v-img :src="user1" aspect-ratio="1"></v-img>
                        </v-card-text>
                    </v-card>
                </v-card-item>
            </v-col>

            <!-- Current Visa -->
            <v-col cols="12" md="4">
                <v-card-item>
                    <v-card elevation="10">
                        <v-card-title class="text-h5">Current Visa</v-card-title>
                        <h6 class="text-subtitle-1 textSecondary">Type of Visa: Residency Visa</h6>
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1"></v-img>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card-item>
            </v-col>
        </v-row>
    </div>
</template>
