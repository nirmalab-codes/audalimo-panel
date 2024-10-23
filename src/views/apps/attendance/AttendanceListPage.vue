<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import AttendanceListTable from '@/components/attendance/AttendanceListTable.vue';
// theme breadcrumb
const page = ref({ title: 'Attendance List' });

const breadcrumbs = ref([
    {
        text: 'Manage attendance',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <AttendanceListTable />
        </v-card-text>
    </v-card>
</template>
