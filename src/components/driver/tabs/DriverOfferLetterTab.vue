<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const fileToUpload = ref<File | null>(null);
const isUploadDone = ref(false);


const downloadOfferLetter = () => {
    // Add your logic to download the offer letter
};

function onFileChange(e: any) {
    fileToUpload.value = e.target.files[0];
}

async function save() {
    if (fileToUpload.value) {
        
    }
}
</script>
<template>
    <div class="ma-4">
        <v-row justify="center">
            <v-col cols="12">
                <h2>Offer Letter</h2>
                <h3 class="text-success">Please upload and fill your form</h3>
                <p class="mb-4">
                    As required by our Terms and Conditions, each driver must complete their offer letter form. You'll need to
                    upload and download documents listed below.
                </p>
                <v-card class="pa-4 mb-4">
                    <v-card-text>
                        <div class="d-flex align-center">
                            <div class="text-white font-weight-bold mr-4">1</div>
                            <div class="flex-grow-1 ml-4">
                                <h3 class="mb-2">Download Offer Letter</h3>
                                <p class="caption">Please download, fill and sign the offer letter with Signatory and Thumb Print.</p>
                            </div>
                            <div>
                                <v-btn color="primary" @click="downloadOfferLetter">
                                    <v-icon left>mdi-download</v-icon>
                                    Download
                                </v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <v-card class="pa-4 mb-4">
                    <v-card-text>
                        <div class="d-flex align-center mb-4">
                            <div class="text-white font-weight-bold mr-4">2</div>
                            <div class="flex-grow-1 ml-4">
                                <h3 class="mb-2">Upload Offer Letter</h3>
                                <p class="caption">Upload your offer letter document.</p>
                            </div>
                            <div class="text-right">
                                <v-chip v-if="isUploadDone" color="success" class="ma-2">Completed</v-chip>
                            </div>
                        </div>
                        <div>
                            <div class="d-flex">
                                <v-file-input ref="fileInputRef" label="File input" density="compact" variant="outlined" @change="onFileChange"></v-file-input>
                                <v-btn class="ml-4" color="success" @click="save">Upload</v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <p class="caption text-center">It will take just a few minutes from here</p>
            </v-col>
        </v-row>
    </div>
</template>
