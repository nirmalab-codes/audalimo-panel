<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TripDetail from '@/components/trip/TripDetail.vue';
// theme breadcrumb
const page = ref({ title: 'Trip Detail' });

const breadcrumbs = ref([
    {
        text: 'Manage trip detail',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <TripDetail />
        </v-card-text>
    </v-card>
</template>
