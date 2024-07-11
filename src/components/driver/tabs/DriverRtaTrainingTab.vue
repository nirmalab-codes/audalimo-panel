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
                <p class="mb-4">
                    Each driver must complete their last step of training. You'll need to complete the task listed below.
                </p>

                <v-card class="pa-4 mb-4">
                    <v-card-text>
                        <div class="d-flex align-center">
                            <div class="text-white font-weight-bold mr-4">1</div>
                            <div class="flex-grow-1 ml-4">
                                <h3 class="mb-2">Join RTA Test</h3>
                                <p class="caption">You need to take the RTA test on the location we give you.</p>
                            </div>
                            <div>
                                <v-btn color="primary" @click="joinRTATest">
                                    Join
                                </v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <h3 class="text-success">After complete the test</h3>
                <p class="mb-4">
                    You can download RTA practice permit.
                </p>

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
