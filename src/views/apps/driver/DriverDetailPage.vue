<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

//Components
import DriverPersonalInfoTab from '@/components/driver/tabs/DriverPersonalInfoTab.vue';

/*tab*/
const tab = ref(null);

// theme breadcrumb
const page = ref({ title: 'Driver Richard' });
</script>

<template>
    <!-- TODO: Find component that lookalike this -->
   <BaseBreadcrumb :title="page.title"></BaseBreadcrumb>
   <h5 class="text-h5 mb-6 mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, eveniet.</h5>
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
                    <DriverPersonalInfoTab/>
                </v-window-item>
                <v-window-item value="ApplicationForm">ApplicationForm</v-window-item>
                <v-window-item value="OfferLetter">OfferLetter</v-window-item>
                <v-window-item value="EmploymentResidency">EmploymentResidency</v-window-item>
                <v-window-item value="RtaTraining">RtaTraining</v-window-item>
           </v-window>
       </v-card-text>
   </v-card>
</template>
