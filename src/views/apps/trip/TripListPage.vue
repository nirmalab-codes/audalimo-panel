<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TripListTable from '@/components/trip/TripListTable.vue';
// theme breadcrumb
const page = ref({ title: 'Trip List' });

const breadcrumbs = ref([
    {
        text: 'Manage create, edit trip',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <TripListTable />
        </v-card-text>
    </v-card>
</template>
