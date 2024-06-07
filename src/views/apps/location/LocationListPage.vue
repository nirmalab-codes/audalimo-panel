<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import LocationListTable from '@/components/location/LocationListTable.vue';
// theme breadcrumb
const page = ref({ title: 'Location List' });

const breadcrumbs = ref([
    {
        text: 'Location List',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <LocationListTable />
        </v-card-text>
    </v-card>
</template>
