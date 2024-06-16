<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import DocumentListTable from '@/components/document/DocumentListTable.vue';
// theme breadcrumb
const page = ref({ title: 'Document List' });

const breadcrumbs = ref([
    {
        text: 'Document List',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <DocumentListTable />
        </v-card-text>
    </v-card>
</template>
