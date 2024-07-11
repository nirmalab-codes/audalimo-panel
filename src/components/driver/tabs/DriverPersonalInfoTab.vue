<script setup lang="ts">
import { ref, onMounted, type PropType, toRef } from 'vue';
import type { DriverDocumentItemDto, DriverItemDto } from '@/contracts/response/DriverRelated.response';
import { useDriverStore } from '@/stores/driver';
import { useRouter } from 'vue-router';
import ApiService from '@/services/ApiService';

const router = useRouter()

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true }
})
const driver = toRef(props, 'driverProp')

const driverStore = useDriverStore();

const driverDocument = ref<DriverDocumentItemDto|null>()
const selfieIds = ref<Map<string, string>>(new Map())
const cvIds = ref<Map<string, string>>(new Map())
const passportIds = ref<Map<string, string>>(new Map())
const emirateIds = ref<Map<string, string>>(new Map())
const visaIds = ref<Map<string, string>>(new Map())

onMounted(async () => {
    driverDocument.value = await driverStore.retrieveLatestDocuments(driver.value.id)
    await Promise.all([
        fetchSelfieId(),
        fetchCvId(),
        fetchPassportId(),
        fetchEmirateId(),
        fetchVisaId(),
    ])
});

const fetchSelfieId = async () => {
    let selfieIdRaw = driverDocument.value?.selfie_id || []
    for (let i = 0; i < selfieIdRaw.length; i++) {
        const element = selfieIdRaw[i];
        selfieIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchCvId = async () => {
    let cvIdRaw = driverDocument.value?.cv_id || []
    for (let i = 0; i < cvIdRaw.length; i++) {
        const element = cvIdRaw[i];
        cvIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchPassportId = async () => {
    let passportIdRaw = driverDocument.value?.photo_passport_id || []
    for (let i = 0; i < passportIdRaw.length; i++) {
        const element = passportIdRaw[i];
        passportIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchEmirateId = async () => {
    let emirateIdRaw = driverDocument.value?.emirates_id || []
    for (let i = 0; i < emirateIdRaw.length; i++) {
        const element = emirateIdRaw[i];
        emirateIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const fetchVisaId = async () => {
    let visaIdRaw = driverDocument.value?.visa_residency || []
    for (let i = 0; i < visaIdRaw.length; i++) {
        const element = visaIdRaw[i];
        visaIds.value.set(element.id, await ApiService.bufferAsByteUrl(element.signed_url))
    }
}

const handleImageClick = (url: string) => {
    if(!url) return
    window.open(url, '_blank')?.focus();
}

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
const changeStatusEnums = ref(['rejected', 'approved']);

// Add Note Form Related
const closeAddNote = () => {
    dialogAddNote.value = false;
    addNoteFormData.value = {
        title: '',
        message: ''
    }
}
const saveAddNote = async () => {
    if(!driverDocument.value) return
    await driverStore.addNote(driverDocument.value.id, {
        doc_notes:addNoteFormData.value.message,
        doc_title_notes:addNoteFormData.value.title,
    })
    closeAddNote();
}

// Change Status Form Related
const closeChangeStatus = () => {
    dialogChangeStatus.value = false;
    changeStatusFormData.value = {
        status: '',
    }
}
const saveChangeStatus = async () => {
    if(!driverDocument.value) return
    await driverStore.updateStatus(driverDocument.value.id, {
        doc_status: changeStatusFormData.value.status
    })
    closeChangeStatus();
}
</script>
<template>
    <div class="ma-4" v-if="driverDocument">
        <v-row>
            <v-col cols="12">
                <div class="d-flex justify-space-between">
                    <div class="details">
                        <h2>Uploaded Documents</h2>
                        <h3>Education</h3>
                        <p>High School: {{ driverDocument.high_school }}</p>
                        <p>University: {{ driverDocument.university }}</p>
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
                                <v-col cols="12" v-for="(item, k) in driverDocument.selfie_id" :key="`cam-item-${item.id}-${k}`">
                                    <v-img :src="selfieIds.get(item.id) || ''" aspect-ratio="1" height="150" @click="handleImageClick(selfieIds.get(item.id) || '')"></v-img>
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
                                <v-col cols="6" v-for="(item, k) in driverDocument.cv_id" :key="`cv-item-${item.id}-${k}`">
                                    <v-img :src="cvIds.get(item.id) || ''" aspect-ratio="1" height="150" @click="handleImageClick(cvIds.get(item.id) || '')"></v-img>
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
                                <v-col cols="6" v-for="(item, k) in driverDocument.photo_passport_id" :key="`passport-item-${item.id}-${k}`">
                                    <v-img :src="passportIds.get(item.id) || ''" aspect-ratio="1" height="150" @click="handleImageClick(passportIds.get(item.id) || '')"></v-img>
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
                                <v-col cols="6" v-for="(item, k) in driverDocument.emirates_id" :key="`emirate-item-${item.id}-${k}`">
                                    <v-img :src="emirateIds.get(item.id) || ''" aspect-ratio="1" height="150" @click="handleImageClick(emirateIds.get(item.id) || '')"></v-img>
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
                        <span>Type of Visa: {{ driverDocument.visa_type }}</span>
                        <div class="mt-5">
                            <v-row>
                                <v-col cols="6" v-for="(item, k) in driverDocument.visa_residency" :key="`visa-item-${item.id}-${k}`">
                                    <v-img :src="visaIds.get(item.id) || ''" aspect-ratio="1" height="150" @click="handleImageClick(visaIds.get(item.id) || '')"></v-img>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
    <div v-else>
        <p>Documents is currently not available</p>
    </div>
</template>
