<script setup lang="ts">
import { ref } from 'vue';

const isUploadDone = ref(false);

const joinRTATest = () => {
    // Add your logic to join the RTA test
};

const downloadPracticePermit = () => {
    // Add your logic to download the practice permit
};
</script>

<template>
    <div class="ma-4">
        <v-row justify="center">
            <v-col cols="12">
                <h2>RTA Test</h2>
                <h3 class="text-success">Please follow the task</h3>
                <p class="mb-4">Each driver must complete their last step of training. You'll need to complete the task listed below.</p>

                <v-card class="pa-4 mb-4">
                    <v-card-text>
                        <div class="d-flex align-center">
                            <div class="text-white font-weight-bold mr-4">1</div>
                            <div class="flex-grow-1 ml-4">
                                <h3 class="mb-2">Join RTA Test</h3>
                                <p class="caption">You need to take the RTA test on the location we give you.</p>
                            </div>
                            <div>
                                <v-btn color="primary" @click="joinRTATest"> Join </v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <h3 class="text-success">After complete the test</h3>
                <p class="mb-4">You can download RTA practice permit.</p>

                <v-card class="pa-4 mb-4">
                    <v-card-text>
                        <div class="d-flex align-center">
                            <div class="text-white font-weight-bold mr-4">2</div>
                            <div class="flex-grow-1 ml-4">
                                <h3 class="mb-2">Download RTA Practice Permit</h3>
                                <p class="caption">You can download RTA practice permit.</p>
                            </div>
                            <div>
                                <v-btn color="success" @click="downloadPracticePermit" disabled>
                                    <v-icon left>mdi-download</v-icon>
                                    Download
                                </v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <p class="caption text-center">It will take just a few minutes from here</p>
            </v-col>
        </v-row>
        <hr class="my-5">
        <v-row justify="center">
            <v-col cols="12">
                <h2>Join RTA Training</h2>
                <h3 class="text-success mb-4">Training Information</h3>

                <v-card color="grey-darken-3" class="pa-4 mb-4">
                    <v-card-title class="text-h6 text-success">Training Information</v-card-title>
                    <v-card-text class="text-white">
                        Each candidate must complete their training. You'll need to attend RTA training.
                    </v-card-text>
                    <v-list color="grey-darken-3">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon color="white">mdi-calendar</v-icon>
                            </template>
                            <v-list-item-title class="text-white">12 January 2024</v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon color="white">mdi-clock-outline</v-icon>
                            </template>
                            <v-list-item-title class="text-white">08:00 GMT+07</v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon color="white">mdi-map-marker</v-icon>
                            </template>
                            <v-list-item-title class="text-white">Jakarta, Indonesia</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-card color="grey-darken-3" class="pa-4 mb-4">
                    <v-card-title class="text-h6 text-success">Wear Dress Code</v-card-title>
                    <v-card-text class="text-white"> To join RTA Training you need to wear the following dress code. </v-card-text>
                    <v-list color="grey-darken-3">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="grey" size="36">1</v-avatar>
                            </template>
                            <v-list-item-title class="text-white">White shirt</v-list-item-title>
                            <v-list-item-subtitle class="text-grey">Please wear formal white shirt.</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="grey" size="36">2</v-avatar>
                            </template>
                            <v-list-item-title class="text-white">Black Pants</v-list-item-title>
                            <v-list-item-subtitle class="text-grey">Please wear black pants</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="grey" size="36">3</v-avatar>
                            </template>
                            <v-list-item-title class="text-white">Brown or Black shoes.</v-list-item-title>
                            <v-list-item-subtitle class="text-grey">You can choose brown or black shoes.</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.number-circle {
    background-color: #ccc;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
