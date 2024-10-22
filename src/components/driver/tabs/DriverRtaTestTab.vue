<script setup lang="ts">
import { ref, computed, onMounted, type PropType, toRef } from 'vue';
import { useDriverStore } from '@/stores/driver';
import { useUploadStore } from '@/stores/apps/upload';
import { type RtaPermitVo, type RtaPermitIdVo, getDefaultRtaPermitVo } from '@/contracts/vo/RtaPermit.vo';
import { type UploadDto } from '@/contracts/response/UploadRelated.response';
import type { DriverItemDto, DriverRtaItemDto } from '@/contracts/response/DriverRelated.response';
import type { UpdateRtaPermitRequest } from '@/contracts/request/DriverRelated.request';

const store = useDriverStore();
const uploadStore = useUploadStore();
const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const isEdit = ref(false);
const fileToUpload = ref<File | null>(null);

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true }
});

const driver = toRef(props, 'driverProp');
const driverRta = ref<DriverRtaItemDto | null>();
const driverStore = useDriverStore();

onMounted(async () => {
    await fetchData();
});

// Methods
function close() {
    dialog.value = false;
}

const fetchData = async () => {
    driverRta.value = await driverStore.retrieveLatestRtaTraining(driver.value.id);
};

async function save() {
    if (fileToUpload.value) {
        const uploadResponse: UploadDto | null = await uploadStore.upload(fileToUpload.value);

        if (uploadResponse) {
            const rtaPermitId: RtaPermitIdVo = {
                id: uploadResponse.id,
                signedUrl: uploadResponse.signed_url
            };
            const updateRtaPermitRequest: UpdateRtaPermitRequest = {
                rta_permit_id: [
                    {
                        id: rtaPermitId.id,
                        signed_url: rtaPermitId.signedUrl
                    }
                ]
            };
            if (!driverRta.value) return;
            await store.updateRtaPermit(driverRta.value.id, updateRtaPermitRequest);
        }
    }
    close();
}

function onFileChange(e: any) {
    fileToUpload.value = e.target.files[0];
}
</script>

<template>
    <v-container>
        <div class="text-center">
            <p class="my-4 text-h2">Candidate already join the test confirmed at {{ driverRta?.joined_rta_date }}</p>
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <p class="my-4">After you upload the RTA Permit, the candidate will be verified as a new driver.</p>
                    <v-btn color="primary" v-bind="props" flat>
                        <v-icon class="mr-2">mdi-cloud-upload</v-icon>Upload RTA Test
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">Upload RTA Permit</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12">
                                    <v-file-input label="Drop files here or click to upload" density="compact" variant="outlined"
                                        @change="onFileChange"></v-file-input>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="close">Cancel</v-btn>
                        <v-btn color="secondary" variant="flat" @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-container>
</template>