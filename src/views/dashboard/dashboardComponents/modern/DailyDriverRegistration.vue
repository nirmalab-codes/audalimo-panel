<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { getPrimary, getSecondary } from '@/utils/UpdateColors';

const select = ref('March 2023');
const items = ref(['March 2023', 'April 2023', 'May 2023']);

/* Chart */
const chartOptions = computed(() => {
    return {
        chart: {
            height: 375,
            type: 'bar',
            fontFamily: `inherit`,
            foreColor: '#adb0bb',
            stacked: true
        },
        colors: [getPrimary.value, getSecondary.value],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '18%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all'
            }
        },

        stroke: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        yaxis: {
            min: -5,
            max: 5,
            tickAmount: 4
        },
        xaxis: {
            categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08'],
            axisBorder: {
                show: false
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        },
        responsive: [
            {
                breakpoint: 991,
                options: {
                    xaxis: {
                        labels: {
                            rotate: -45
                        },
                        categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08']
                    }
                }
            }
        ]
    };
});
const lineChart = {
    series: [
        {
            name: 'Eanings this month',
            data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0]
        },
        {
            name: 'Expense this month',
            data: [-1.5, -1.1, -2.5, -1.5, -0.6, -1.8]
        }
    ]
};
</script>
<template>
    <v-card elevation="10" >
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between">
                <div>
                    <v-card-title class="text-h5">Daily Driver Registration</v-card-title>
                    <v-card-subtitle class="text-subtitle-1 textSecondary">Lorem ipsum dolor sit amet.</v-card-subtitle>
                </div>
                <div class="my-sm-0 my-2">
                    <v-select v-model="select" :items="items" variant="outlined" density="compact" hide-details></v-select>
                </div>
            </div>

            <v-row>
                <v-col cols="12" sm="12" class="pt-7">
                    <apexchart type="bar" height="375" :options="chartOptions" :series="lineChart.series"> </apexchart>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
