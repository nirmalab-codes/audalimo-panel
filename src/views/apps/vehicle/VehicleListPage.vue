<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import VehicleListTable from '@/components/vehicle/VehicleListTable.vue';
// theme breadcrumb
const page = ref({ title: 'Vehicle List' });

const breadcrumbs = ref([
    {
        text: 'Manage create, edit, and delete vehicle for onboarding',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <VehicleListTable />
        </v-card-text>
    </v-card>
</template>
