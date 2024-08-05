<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { type DriverItemDto } from '@/contracts/response/DriverRelated.response';

const route = useRoute()
const id = ref(route.params.id as string)

// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

//Components
import DriverPersonalInfoTab from '@/components/driver/tabs/DriverPersonalInfoTab.vue';
import DriverApplicationFormTab from '@/components/driver/tabs/DriverApplicationFormTab.vue';
import DriverOfferLetterTab from '@/components/driver/tabs/DriverOfferLetterTab.vue';
import DriverEmploymentResidencyTab from '@/components/driver/tabs/DriverEmploymentResidencyTab.vue';
import DriverRtaTrainingTab from '@/components/driver/tabs/DriverRtaTrainingTab.vue';
import { useDriverStore } from '@/stores/driver';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

/*tab*/
const tab = ref(null);

// store
const driverStore = useDriverStore()
const { driverList } = storeToRefs(driverStore)

// ref
const driver = ref<DriverItemDto | null>(null)

// theme breadcrumb
const page = ref({ title: `Driver` });

// action
onMounted(async () => {
    if(driverList.value.length <= 0){
        await driverStore.retrieveList()
    }
    driver.value = driverList.value.find(i => i.id == id.value) || null
    page.value.title = `Driver ${driver.value?.first_name} ${driver.value?.last_name}`
})

</script>

<template>
    <!-- TODO: Find component that lookalike this -->
   <BaseBreadcrumb :title="page.title" :description="driver?.email"></BaseBreadcrumb>
   <v-card elevation="10" class=" " rounded="md">
       <v-tabs v-model="tab" bg-color="transparent" color="primary">
           <v-tab value="Documents" class="text-medium-emphasis">Documents</v-tab>
           <v-tab value="ApplicationForm" class="text-medium-emphasis">Application Form</v-tab>
           <v-tab value="OfferLetter" class="text-medium-emphasis">Offer Letter</v-tab>
           <v-tab value="EmploymentResidency" class="text-medium-emphasis">Employment & Residency</v-tab>
           <v-tab value="RtaTraining" class="text-medium-emphasis">RTA Training</v-tab>
       </v-tabs>
       <v-divider></v-divider>
       <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
           <v-window v-model="tab">
                <v-window-item value="Documents">
                    <DriverPersonalInfoTab :driverProp="driver" v-if="driver"/>
                </v-window-item>
                <v-window-item value="ApplicationForm">
                    <DriverApplicationFormTab :driverProp="driver" v-if="driver"/>
                </v-window-item>
                <v-window-item value="OfferLetter">
                    <DriverOfferLetterTab :driverProp="driver" v-if="driver"/>
                </v-window-item>
                <v-window-item value="EmploymentResidency">
                    <DriverEmploymentResidencyTab :driverProp="driver" v-if="driver"/>
                </v-window-item>
                <v-window-item value="RtaTraining">
                    <DriverRtaTrainingTab :driverProp="driver" v-if="driver"/>
                </v-window-item>
           </v-window>
       </v-card-text>
   </v-card>
</template>
