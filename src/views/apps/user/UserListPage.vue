<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UserListTable from '@/components/user/UserListTable.vue';
// theme breadcrumb
const page = ref({ title: 'User List' });

const breadcrumbs = ref([
    {
        text: 'Manage create, edit, and delete user',
        disabled: true,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-text>
            <UserListTable />
        </v-card-text>
    </v-card>
</template>
