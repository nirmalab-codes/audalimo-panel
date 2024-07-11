<script setup lang="ts">
import type { DriverApplicationFormItemDto, DriverItemDto } from '@/contracts/response/DriverRelated.response';
import { getEnumKeyByEnumValue } from '@/enums/base';
import { UserGender } from '@/enums/UserRelated.enum';
import { useDriverStore } from '@/stores/driver';
import { onMounted, type PropType, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter()

const props = defineProps({
    driverProp: { type: Object as PropType<DriverItemDto>, required: true }
})
const driver = toRef(props, 'driverProp')

const driverStore = useDriverStore();

const driverApplicationForm = ref<DriverApplicationFormItemDto|null>()

onMounted(async () => {
    driverApplicationForm.value = await driverStore.retrieveLatestApplicationForm(driver.value.id)
});
</script>
<template>
    <form v-if="driverApplicationForm">
        <h2 class="mb-2">Personal Information</h2>
        <v-row>
            <v-col cols="12" class="mb-3">
                <v-label class=" font-weight-medium">Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Name" hide-details :value="driverApplicationForm?.job_fullname"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Place & date of birth</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Date of birth" hide-details :value="`${driverApplicationForm?.job_place_birth} / ${driverApplicationForm?.job_date_birth}`"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Age</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Age" hide-details :value="driverApplicationForm?.job_age"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Gender</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Gender" hide-details :value="getEnumKeyByEnumValue(UserGender, driverApplicationForm?.job_gender)"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
                <v-label class=" font-weight-medium">ID Number</v-label>
                <v-text-field variant="outlined" type="text" placeholder="ID Number" hide-details :value="driverApplicationForm?.job_passport_number"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
                <v-label class=" font-weight-medium">Nationality</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Nationality" hide-details :value="driverApplicationForm?.job_nation"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
                <v-label class=" font-weight-medium">Contact Phone</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Contact Phone" hide-details :value="driverApplicationForm?.cn_mobile"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
                <v-label class=" font-weight-medium">Contact Home</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Contact Home" hide-details :value="driverApplicationForm?.cn_home"/>
            </v-col>
            <v-col cols="12" class="mb-3">
                <v-label class=" font-weight-medium">Religion</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Religion" hide-details :value="driverApplicationForm?.job_religion"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
                <v-label class=" font-weight-medium">Father Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Father Name" hide-details :value="driverApplicationForm?.job_fathername"/>
            </v-col>
            <v-col cols="12" md="6" class="mb-3">
                <v-label class=" font-weight-medium">Mother Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Mother Name" hide-details :value="driverApplicationForm?.job_mothername"/>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Company Information</h2>
        <v-row>
            <v-col cols="12" class="mb-3">
                <v-label class=" font-weight-medium">Company Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Company Name" hide-details :value="driverApplicationForm?.job_name_company"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Current Job</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_present"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Current Position</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_position"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Current Division</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_division"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Join Date</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_date_join"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Place Issue</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_place_issue"/>
            </v-col>
            <v-col cols="12" md="4" class="mb-3">
                <v-label class=" font-weight-medium">Expiry</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Current Position" hide-details :value="driverApplicationForm?.job_date_expiry"/>
            </v-col>
        </v-row>
        <h2 class="mb-2 mt-4">Emergency Information</h2>
        <v-row>
            <v-col cols="12" class="mb-3">
                <v-label class=" font-weight-medium">Name</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Name" hide-details :value="driverApplicationForm?.cp_emergency_name"/>
            </v-col>
            <v-col cols="12" class="mb-3">
                <v-label class=" font-weight-medium">Phone Number</v-label>
                <v-text-field variant="outlined" type="text" placeholder="Phone Number" hide-details :value="driverApplicationForm?.cp_emergency_number"/>
            </v-col>
        </v-row>
    </form>
    <div v-else>Application Form is currently not available</div>
</template>
