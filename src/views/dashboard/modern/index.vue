<script setup lang="ts">
/*Call Components*/
import DailyDriverRegistration from "../dashboardComponents/modern/DailyDriverRegistration.vue";
import Pending from "../dashboardComponents/modern/Pending.vue";
import TopProjects from "../dashboardComponents/modern/TopProjects.vue";

</script>
<template>
    <v-row>
         <v-col cols="12">
           <v-row>
                <v-col cols="12" lg="3" md="12">
                    <Pending/>
                </v-col>
                <v-col cols="12" lg="3" md="12">
                    <Pending/>
                </v-col>
                <v-col cols="12" lg="3" md="12">
                    <Pending/>
                </v-col>
                <v-col cols="12" lg="3" md="12">
                    <Pending/>
                </v-col>

                <v-col cols="12" lg="6" md="12">
                    <TopProjects/>
                </v-col>
                <v-col cols="12" lg="6" md="12">
                    <DailyDriverRegistration/>
                </v-col>
           </v-row>
        </v-col>    
    </v-row>
</template>