<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import VehicleDetail from '@/components/vehicle/VehicleDetail.vue';
import VehicleQAT from '@/components/vehicle/VehicleQAT.vue';
// theme breadcrumb
const page = ref({ title: 'Vehicle Detail' });

const breadcrumbs = ref([
    {
        text: 'Manage vehicle detail',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->
    <VehicleDetail />
</template>
