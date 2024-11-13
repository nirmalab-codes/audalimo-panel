<template>
    <div class="space-y-6">
        <v-card-title class="text-h6">
            Realtime Tracking <v-chip class="truncate text-small">{{ vehicle.qat_last_updated || 'N/A' }}</v-chip></v-card-title
        >
        <v-card-text>
            <v-row>
                <v-col v-for="(item, index) in qatItems" :key="index" cols="12" sm="6" md="4">
                    <div class="d-flex align-center">
                        <component :is="item.icon" class="mr-2" :size="20" />
                        <div>
                            <div class="text-caption text-medium-emphasis">{{ item.label }}</div>
                            <div class="text-body-1">{{ item.value }}</div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MapPinIcon, CompassIcon, SpeedboatIcon, PowerIcon, UsersIcon } from 'vue-tabler-icons';

const props = defineProps({
    vehicle: {
        type: Object,
        default: () => ({})
    }
});

const defaultQatData = {
    qat_latitude: 0,
    qat_longitude: 0,
    qat_speed: 0,
    qat_odometer: 0,
    qat_direction: 0,
    qat_ignition: false,
    qat_seat_count: 0
};

const safeQatData = computed(() => ({ ...defaultQatData, ...props.vehicle }));

const qatItems = computed(() => [
    { icon: MapPinIcon, label: 'Location', value: `${safeQatData.value.qat_latitude}, ${safeQatData.value.qat_longitude}` },
    { icon: CompassIcon, label: 'Direction', value: `${safeQatData.value.qat_direction}°` },
    { icon: SpeedboatIcon, label: 'Speed', value: `${safeQatData.value.qat_speed} km/h` },
    { icon: SpeedboatIcon, label: 'Odometer', value: `${safeQatData.value.qat_odometer} km` },
    { icon: PowerIcon, label: 'Ignition', value: safeQatData.value.qat_ignition ? 'On' : 'Off' },
    { icon: UsersIcon, label: 'Seat Count', value: safeQatData.value.qat_seat_count }
]);
</script>
