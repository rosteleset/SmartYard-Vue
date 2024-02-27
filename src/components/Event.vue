<script setup lang="ts">
import { Event } from '../types/events';


const props = defineProps<{ event: Event }>();



</script>

<template>
    <div class="event">
        {{ props.event.uuid }}
    </div>
</template>

<style scoped lang="scss">
.event {
}
</style>
