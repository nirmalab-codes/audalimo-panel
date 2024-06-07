<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useContactStore } from '@/stores/apps/contact';
import user1 from '@/assets/images/profile/user-1.jpg';

const store = useContactStore();

onMounted(() => {
});

const valid = ref(true);
const dialogAddNote = ref(false);
const dialogChangeStatus = ref(false);

// Form Data
const addNoteFormData = ref({
    title: '',
    message: ''
});
const changeStatusFormData = ref({
    status: '',
});

// Enums
const changeStatusEnums = ref(['REJECTED', 'APPROVED']);

// Add Note Form Related
function closeAddNote() {
    dialogAddNote.value = false;
}
function saveAddNote() {
    closeAddNote();
}

// Change Status Form Related
function closeChangeStatus() {
    dialogChangeStatus.value = false;
}
function saveChangeStatus() {
    closeChangeStatus();
}
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
                        <v-dialog v-model="dialogAddNote" max-width="500">
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                    <v-icon class="mr-2">mdi-note</v-icon>Add Note
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="pa-4 bg-secondary">
                                    <span class="title text-white">Add Note</span>
                                </v-card-title>
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1" :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white"
                                        >To send notifications or intructions to the driver, fields or forms need to be correct.</span
                                    >
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" v-model="valid" lazy-validation>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field
                                                    variant="outlined"
                                                    hide-details
                                                    v-model="addNoteFormData.title"
                                                    label="Title"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea
                                                    label="Message"
                                                    v-model="addNoteFormData.message"
                                                    auto-grow
                                                    variant="outlined"
                                                    placeholder="Hi, Do you  have a moment to talk Jeo ?"
                                                    rows="4"
                                                    color="primary"
                                                    row-height="25"
                                                    shaped
                                                    hide-details
                                                ></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeAddNote">Cancel</v-btn>
                                    <v-btn
                                        color="secondary"
                                        :disabled="addNoteFormData.title == '' || addNoteFormData.message == ''"
                                        variant="flat"
                                        @click="saveAddNote"
                                        >Save</v-btn
                                    >
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogChangeStatus" max-width="500">
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                    <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Change Status
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="pa-4 bg-secondary">
                                    <span class="title text-white">Add Note</span>
                                </v-card-title>
                                <v-card-subtitle class="pb-4 bg-secondary text-subtitle-1" :style="{ 'white-space': 'preserve' }">
                                    <span class="title text-white"
                                        >To change the form status so that the driver can proceed to the next step.</span
                                    >
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-form ref="form" v-model="valid" lazy-validation>
                                        <v-row>
                                            <v-col cols="12" sm="12">
                                                <v-select
                                                    variant="outlined"
                                                    hide-details
                                                    :items="changeStatusEnums"
                                                    v-model="changeStatusFormData.status"
                                                    label="Role Background"
                                                ></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>

                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" @click="closeChangeStatus">Cancel</v-btn>
                                    <v-btn
                                        color="secondary"
                                        :disabled="changeStatusFormData.status == ''"
                                        variant="flat"
                                        @click="saveChangeStatus"
                                        >Save</v-btn
                                    >
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
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
                    </v-card-item>
                    <v-card-text>
                        <span
                            >Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.</span
                        >
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="12">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- CV Upload -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5">CV Upload</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <span
                            >Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.</span
                        >
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- CV Upload -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5">Passport</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <span
                            >Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.</span
                        >
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Emirates ID -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item class="pb-sm-8 pb-6">
                        <v-card-title class="text-h5">Emirates ID</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <span
                            >Identification your face in the middle of the frame and follow the instructions. Photo should not be blurry and
                            must be evenly taken.</span
                        >
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="12">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Current Visa -->
            <v-col cols="12" md="4">
                <v-card elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5">Current Visa</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <span>Type of Visa: Residency Visa</span>
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="user1" aspect-ratio="1" height="150"></v-img>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
