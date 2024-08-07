<script setup lang="ts">
import Pending from "../dashboardComponents/modern/Pending.vue";
import TopCards from "../dashboardComponents/modern/TopCards.vue";
import TopProjects from "../dashboardComponents/modern/TopProjects.vue";
import WeeklyStats from "../dashboardComponents/modern/WeeklyStats.vue";

</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-col cols="12">
                    <TopCards />
                </v-col>
                <!-- <v-col cols="12" lg="6" md="12">
                    <Pending />
                </v-col>
                <v-col cols="12" lg="6" md="12">
                    <Pending />
                </v-col>
                <v-col cols="12" lg="4" sm="6">
                    <WeeklyStats />
                </v-col>
                <v-col cols="12" lg="8" md="12">
                    <TopProjects />
                </v-col> -->
                <!-- <v-col cols="12" lg="6" md="12">
                    <DailyDriverRegistration/>
                </v-col> -->
            </v-row>
        </v-col>
    </v-row>
</template>