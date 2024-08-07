<script setup lang="ts">
// import { topCardsData } from '@/_mockApis/components/dashboard/modernData';
import ApiService from '@/services/ApiService';
import { onMounted, ref } from 'vue';

const loading = ref(true)
const progress = ref([])
const getProgress = async () => {
    try {
        loading.value = true;
        const params = { pageSize: 1000 }
        const response = await ApiService.vueInstance.axios.get("/v1/progress", { params });
        const { data: { data } } = response
        progress.value = data;
        console.log(progress.value)
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await getProgress();
});

const steps = ["step1", "step2", "step3", "step4", "step5", "step6"];
const steps_name = ["KYC Document", "Application Form", "Offer Letter", "Residency", "RTA Training", "RTA Test"];
const statusReview = "review";

// Arrays for bgcolor and textcolor
const bgColors = ["lightprimary", "lightwarning", "lightsecondary", "lighterror", "lightsuccess", "lightprimary"];
const textColors = ["primary", "warning", "secondary", "error", "success", "primary"];

const topCardsData = (data: any) => steps.map((step, index) => {
    const count = data.filter((item: any) => item.step === step && item.status_step === statusReview).length;
    return {
        img: `card_icon${index + 1}`,
        title: step,
        number: count.toString(),
        bgcolor: bgColors[index],
        textcolor: textColors[index]
    };
});

console.log(topCardsData)

</script>
<template>
    <v-card elevation="10">
        <v-card-item>
            <v-card-title class="text-h5  pl-0">Verification Status</v-card-title>
            <v-card-subtitle class="text-subtitle-1 textSecondary mb-4 pl-0">Total drivers need to be
                review</v-card-subtitle>

            <v-row>
                <v-col cols="12" lg="2" md="4" sm="4" v-for="(card, index) in topCardsData(progress)" :key="card.title">
                    <div
                        :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-' + card.bgcolor">
                        <div :class="'bg-' + card.bgcolor">
                            <!-- <img :src="card.img" alt="icon" /> -->
                            <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-' + card.textcolor"
                                v-text="steps_name[index]"></div>
                            <h4 :class="'text-h4 mt-1 text-' + card.textcolor" v-text="card.number"></h4>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

</template>
