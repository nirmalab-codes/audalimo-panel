<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import DriverTable from '@/components/table/DriverTable.vue';
// theme breadcrumb
const page = ref({ title: 'Driver List' });

const breadcrumbs = ref([
    {
        text: '2 New Drivers',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <DriverTable />
        </v-card-text>
    </v-card>
</template>
