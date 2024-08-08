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
    const statusMap: Record<string, { label: string; color: string, disabled: boolean }> = {
        [StatusStep.Open]: { label: 'not filled', color: 'info', disabled: true },
        [StatusStep.Pending]: { label: 'not filled', color: 'info', disabled: true },
        [StatusStep.Review]: { label: 'need to review', color: 'warning', disabled: false },
        [StatusStep.Approved]: { label: '✔', color: 'success', disabled: false },
        [StatusStep.Rejected]: { label: 'rejected', color: 'error', disabled: false }
    };

    return allStatus.value.reduce((acc, status) => {
        const stepLabel = stepLabelMap[status.step];
        if (stepLabel) {
            acc[stepLabel] = statusMap[status.status_step];
        }
        return acc;
    }, {} as Record<string, { label: string; color: string, disabled: boolean }>);
});

</script>

<template>
    <BaseBreadcrumb :title="page.title" :description="driver?.email"></BaseBreadcrumb>
    <v-card elevation="10" class=" " rounded="md">
        <v-tabs v-model="tab" bg-color="transparent" color="primary">
            <template v-if="tabBadges.Documents">
                <v-tab value="Documents" class="text-medium-emphasis" :disabled="tabBadges?.Documents?.disabled">
                    <span class="mr-2">Documents</span>
                    <v-chip :color="tabBadges.Documents.color" size="small" class="ml-auto">
                        <small>{{ tabBadges.Documents.label }}</small>
                    </v-chip>
                </v-tab>
            </template>
            <template v-if="tabBadges.ApplicationForm">
                <v-tab value="ApplicationForm" class="text-medium-emphasis"
                    :disabled="tabBadges?.ApplicationForm?.disabled">
                    Application Form
                    <v-chip :color="tabBadges.ApplicationForm.color" size="small" class="ml-2">
                        <small>{{ tabBadges.ApplicationForm.label }}</small>
                    </v-chip>
                </v-tab>
            </template>
            <template v-if="tabBadges.OfferLetter">
                <v-tab value="OfferLetter" class="text-medium-emphasis" :disabled="tabBadges?.OfferLetter?.disabled">
                    Offer Letter
                    <v-chip :color="tabBadges.OfferLetter.color" size="small" class="ml-2">
                        <small>{{ tabBadges.OfferLetter.label }}</small>
                    </v-chip>
                </v-tab>
            </template>
            <template v-if="tabBadges.EmploymentResidency">
                <v-tab value="EmploymentResidency" class="text-medium-emphasis"
                    :disabled="tabBadges.EmploymentResidency.disabled">
                    {{ "Employment & Residency" }}
                    <v-chip :color="tabBadges?.EmploymentResidency?.color" size="small" class="ml-2">
                        <small>{{ tabBadges.EmploymentResidency.label }}</small>
                    </v-chip>
                </v-tab>
            </template>
            <template v-if="tabBadges.RtaTraining">
                <v-tab value="RtaTraining" class="text-medium-emphasis" :disabled="tabBadges?.RtaTraining?.disabled">
                    RTA Training
                    <v-chip :color="tabBadges.RtaTraining.color" size="small" class="ml-2">
                        <small>{{ tabBadges.RtaTraining.label }}</small>
                    </v-chip>
                </v-tab>
            </template>
            <template v-if="tabBadges.RtaTest">
                <v-tab value="RtaTest" class="text-medium-emphasis" :disabled="tabBadges?.RtaTest?.disabled">
                    RTA Test
                    <v-chip :color="tabBadges.RtaTest.color" size="small" class="ml-2">
                        <small>{{ tabBadges.RtaTest.label }}</small>
                    </v-chip>
                </v-tab>
            </template>
        </v-tabs>
        <v-divider></v-divider>
        <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
            <v-window v-model="tab">
                <v-window-item value="Documents">
                    <DriverPersonalInfoTab :driverProp="driver" :statusProp="allStatus.find(i => i.step == 'step1')" v-if="driver" />
                </v-window-item>
                <v-window-item value="ApplicationForm">
                    <DriverApplicationFormTab :driverProp="driver" :statusProp="allStatus.find(i => i.step == 'step2')" v-if="driver" />
                </v-window-item>
                <v-window-item value="OfferLetter">
                    <DriverOfferLetterTab :driverProp="driver" :statusProp="allStatus.find(i => i.step == 'step3')" v-if="driver" />
                </v-window-item>
                <v-window-item value="EmploymentResidency">
                    <DriverEmploymentResidencyTab :driverProp="driver" :statusProp="allStatus.find(i => i.step == 'step4')" v-if="driver" />
                </v-window-item>
                <v-window-item value="RtaTraining">
                    <DriverRtaTrainingTab :driverProp="driver" :statusProp="allStatus.find(i => i.step == 'step5')" v-if="driver" />
                </v-window-item>
                <v-window-item value="RtaTest">
                    <DriverRtaTestTab :driverProp="driver" :statusProp="allStatus.find(i => i.step == 'step6')" v-if="driver" />
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>
