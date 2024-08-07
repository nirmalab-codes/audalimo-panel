<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { type DriverItemDto, type DriverStepItemDto } from '@/contracts/response/DriverRelated.response';
import { StatusStep } from '@/contracts/response/DriverRelated.response';

const route = useRoute();
const id = ref(route.params.id as string);

// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

//Components
import DriverPersonalInfoTab from '@/components/driver/tabs/DriverPersonalInfoTab.vue';
import DriverApplicationFormTab from '@/components/driver/tabs/DriverApplicationFormTab.vue';
import DriverOfferLetterTab from '@/components/driver/tabs/DriverOfferLetterTab.vue';
import DriverEmploymentResidencyTab from '@/components/driver/tabs/DriverEmploymentResidencyTab.vue';
import DriverRtaTrainingTab from '@/components/driver/tabs/DriverRtaTrainingTab.vue';
import DriverRtaTestTab from '@/components/driver/tabs/DriverRtaTestTab.vue';
import { useDriverStore } from '@/stores/driver';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

/*tab*/
const tab = ref(null);

// store
const driverStore = useDriverStore();
const { driverList } = storeToRefs(driverStore);

// ref
const driver = ref<DriverItemDto | null>(null);
const allStatus = ref<DriverStepItemDto[]>([]);

// theme breadcrumb
const page = ref({ title: `Driver` });

// action
onMounted(async () => {
    if (driverList.value.length <= 0) {
        await driverStore.retrieveList();
    }
    allStatus.value = await driverStore.retrieveAllStatus(id.value);

    driver.value = driverList.value.find((i) => i.id == id.value) || null;
    page.value.title = `Driver ${driver.value?.first_name} ${driver.value?.last_name}`;
});

// map step to label
const stepLabelMap: Record<string, string> = {
    step1: 'Documents',
    step2: 'ApplicationForm',
    step3: 'OfferLetter',
    step4: 'EmploymentResidency',
    step5: 'RtaTraining',
    step6: 'RtaTest'
};

// computed property to map status to badge details
const tabBadges = computed(() => {
    const statusMap: Record<string, { label: string; color: string }> = {
        [StatusStep.Open]: { label: 'not filled', color: 'warning' },
        [StatusStep.Pending]: { label: 'not filled', color: 'warning' },
        [StatusStep.Review]: { label: 'need to be review', color: 'secondary' },
        [StatusStep.Approved]: { label: '✔', color: 'success' },
        [StatusStep.Rejected]: { label: 'rejected', color: 'error' }
    };

    return allStatus.value.reduce((acc, status) => {
        const stepLabel = stepLabelMap[status.step];
        if (stepLabel) {
            acc[stepLabel] = statusMap[status.status_step];
        }
        return acc;
    }, {} as Record<string, { label: string; color: string }>);
});
</script>

<template>
    <BaseBreadcrumb :title="page.title" :description="driver?.email"></BaseBreadcrumb>
    <v-card elevation="10" class=" " rounded="md">
        <v-tabs v-model="tab" bg-color="transparent" color="primary">
            <v-tab value="Documents" class="text-medium-emphasis">
                <span class="mr-2">Documents</span>
                <v-chip v-if="tabBadges.Documents" :color="tabBadges.Documents.color" size="small" class="ml-auto">
                    {{ tabBadges.Documents.label }}
                </v-chip>
            </v-tab>
            <v-tab value="ApplicationForm" class="text-medium-emphasis">
                Application Form
                <v-chip v-if="tabBadges.ApplicationForm" :color="tabBadges.ApplicationForm.color" size="small" class="ml-2">
                    {{ tabBadges.ApplicationForm.label }}
                </v-chip>
            </v-tab>
            <v-tab value="OfferLetter" class="text-medium-emphasis">
                Offer Letter
                <v-chip v-if="tabBadges.OfferLetter" :color="tabBadges.OfferLetter.color" size="small" class="ml-2">
                    {{ tabBadges.OfferLetter.label }}
                </v-chip>
            </v-tab>
            <v-tab value="EmploymentResidency" class="text-medium-emphasis">
                Employment & Residency
                <v-chip v-if="tabBadges.EmploymentResidency" :color="tabBadges.EmploymentResidency.color" size="small" class="ml-2">
                    {{ tabBadges.EmploymentResidency.label }}
                </v-chip>
            </v-tab>
            <v-tab value="RtaTraining" class="text-medium-emphasis">
                RTA Training
                <v-chip v-if="tabBadges.RtaTraining" :color="tabBadges.RtaTraining.color" size="small" class="ml-2">
                    {{ tabBadges.RtaTraining.label }}
                </v-chip>
            </v-tab>
            <v-tab value="RtaTest" class="text-medium-emphasis">
                RTA Test
                <v-chip v-if="tabBadges.RtaTest" :color="tabBadges.RtaTest.color" size="small" class="ml-2">
                    {{ tabBadges.RtaTest.label }}
                </v-chip>
            </v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
            <v-window v-model="tab">
                <v-window-item value="Documents">
                    <DriverPersonalInfoTab :driverProp="driver" v-if="driver" />
                </v-window-item>
                <v-window-item value="ApplicationForm">
                    <DriverApplicationFormTab :driverProp="driver" v-if="driver" />
                </v-window-item>
                <v-window-item value="OfferLetter">
                    <DriverOfferLetterTab :driverProp="driver" v-if="driver" />
                </v-window-item>
                <v-window-item value="EmploymentResidency">
                    <DriverEmploymentResidencyTab :driverProp="driver" v-if="driver" />
                </v-window-item>
                <v-window-item value="RtaTraining">
                    <DriverRtaTrainingTab :driverProp="driver" v-if="driver" />
                </v-window-item>
                <v-window-item value="RtaTest">
                    <DriverRtaTestTab :driverProp="driver" v-if="driver" />
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>
