<script setup lang="ts">
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- mega menu DD -->
    <!-- ---------------------------------------------- -->
    <router-link to="/dashboards" class="text-decoration-none">
        <v-btn variant="text" color="primary">Dashboard </v-btn>
    </router-link>
    <router-link to="/apps/drivers" class="text-decoration-none">
        <v-btn variant="text" color="primary">Drivers </v-btn>
    </router-link>
    <router-link to="/apps/schedule" class="text-decoration-none">
        <v-btn variant="text" color="primary">Schedule </v-btn>
    </router-link>
    <router-link to="/apps/locations" class="text-decoration-none">
        <v-btn variant="text" color="primary">Locations </v-btn>
    </router-link>
    <router-link to="/apps/documents" class="text-decoration-none">
        <v-btn variant="text" color="primary">Documents </v-btn>
    </router-link>
    <router-link to="/apps/notifications" class="text-decoration-none">
        <v-btn variant="text" color="primary">Notifications </v-btn>
    </router-link>
</template>
